use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod vegais_vault {
    use super::*;

    pub fn initialize_vault(
        ctx: Context<InitializeVault>,
        vault_name: String,
        vault_symbol: String,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.authority = ctx.accounts.authority.key();
        vault.name = vault_name;
        vault.symbol = vault_symbol;
        vault.total_deposits = 0;
        vault.total_withdrawals = 0;
        vault.total_fees = 0;
        vault.is_active = true;
        vault.bump = *ctx.bumps.get("vault").unwrap();
        
        msg!("Vault initialized: {}", vault.name);
        Ok(())
    }

    pub fn deposit(
        ctx: Context<Deposit>,
        amount: u64,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        let user_account = &mut ctx.accounts.user_account;
        
        // Transfer tokens from user to vault
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.user_token_account.to_account_info(),
                to: ctx.accounts.vault_token_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        );
        token::transfer(transfer_ctx, amount)?;

        // Update vault state
        vault.total_deposits = vault.total_deposits.checked_add(amount).unwrap();
        
        // Update user account
        if user_account.user == Pubkey::default() {
            user_account.user = ctx.accounts.user.key();
            user_account.total_deposited = amount;
            user_account.current_balance = amount;
        } else {
            user_account.total_deposited = user_account.total_deposited.checked_add(amount).unwrap();
            user_account.current_balance = user_account.current_balance.checked_add(amount).unwrap();
        }
        user_account.last_deposit = Clock::get()?.unix_timestamp;

        msg!("Deposit successful: {} tokens", amount);
        Ok(())
    }

    pub fn withdraw(
        ctx: Context<Withdraw>,
        amount: u64,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        let user_account = &mut ctx.accounts.user_account;
        
        // Check if user has sufficient balance
        require!(
            user_account.current_balance >= amount,
            VaultError::InsufficientBalance
        );

        // Check withdrawal cooldown (24 hours)
        let current_time = Clock::get()?.unix_timestamp;
        require!(
            current_time - user_account.last_withdrawal >= 86400, // 24 hours
            VaultError::WithdrawalCooldown
        );

        // Transfer tokens from vault to user
        let transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault_token_account.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.vault.to_account_info(),
            },
            &[&[b"vault", &[vault.bump]]],
        );
        token::transfer(transfer_ctx, amount)?;

        // Update vault state
        vault.total_withdrawals = vault.total_withdrawals.checked_add(amount).unwrap();
        
        // Update user account
        user_account.current_balance = user_account.current_balance.checked_sub(amount).unwrap();
        user_account.last_withdrawal = current_time;

        msg!("Withdrawal successful: {} tokens", amount);
        Ok(())
    }

    pub fn execute_bet(
        ctx: Context<ExecuteBet>,
        bet_id: String,
        amount: u64,
        strategy_id: String,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        let user_account = &mut ctx.accounts.user_account;
        let bet_record = &mut ctx.accounts.bet_record;
        
        // Check if user has sufficient balance
        require!(
            user_account.current_balance >= amount,
            VaultError::InsufficientBalance
        );

        // Create bet record
        bet_record.bet_id = bet_id;
        bet_record.user = ctx.accounts.user.key();
        bet_record.strategy_id = strategy_id;
        bet_record.amount = amount;
        bet_record.status = BetStatus::Pending;
        bet_record.created_at = Clock::get()?.unix_timestamp;
        bet_record.bump = *ctx.bumps.get("bet_record").unwrap();

        // Update user account
        user_account.current_balance = user_account.current_balance.checked_sub(amount).unwrap();

        msg!("Bet executed: {} tokens for bet {}", amount, bet_id);
        Ok(())
    }

    pub fn settle_bet(
        ctx: Context<SettleBet>,
        result: BetResult,
        profit: i64,
    ) -> Result<()> {
        let bet_record = &mut ctx.accounts.bet_record;
        let user_account = &mut ctx.accounts.user_account;
        let vault = &mut ctx.accounts.vault;
        
        require!(
            bet_record.status == BetStatus::Pending,
            VaultError::BetAlreadySettled
        );

        // Update bet record
        bet_record.result = result;
        bet_record.profit = profit;
        bet_record.status = BetStatus::Settled;
        bet_record.settled_at = Clock::get()?.unix_timestamp;

        // Update user account
        if profit > 0 {
            user_account.current_balance = user_account.current_balance.checked_add(profit as u64).unwrap();
            user_account.total_earnings = user_account.total_earnings.checked_add(profit as u64).unwrap();
        }

        // Update vault statistics
        if profit > 0 {
            vault.total_earnings = vault.total_earnings.checked_add(profit as u64).unwrap();
        }

        msg!("Bet settled: {} profit", profit);
        Ok(())
    }

    pub fn collect_fees(
        ctx: Context<CollectFees>,
        amount: u64,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        
        require!(
            ctx.accounts.authority.key() == vault.authority,
            VaultError::Unauthorized
        );

        // Transfer fees to authority
        let transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault_token_account.to_account_info(),
                to: ctx.accounts.authority_token_account.to_account_info(),
                authority: ctx.accounts.vault.to_account_info(),
            },
            &[&[b"vault", &[vault.bump]]],
        );
        token::transfer(transfer_ctx, amount)?;

        vault.total_fees = vault.total_fees.checked_add(amount).unwrap();

        msg!("Fees collected: {} tokens", amount);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = authority,
        space = Vault::LEN,
        seeds = [b"vault"],
        bump
    )]
    pub vault: Account<'info, Vault>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut, seeds = [b"vault"], bump = vault.bump)]
    pub vault: Account<'info, Vault>,
    
    #[account(
        init_if_needed,
        payer = user,
        space = UserAccount::LEN,
        seeds = [b"user_account", user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub vault_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut, seeds = [b"vault"], bump = vault.bump)]
    pub vault: Account<'info, Vault>,
    
    #[account(
        mut,
        seeds = [b"user_account", user.key().as_ref()],
        bump,
        has_one = user
    )]
    pub user_account: Account<'info, UserAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub vault_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
#[instruction(bet_id: String)]
pub struct ExecuteBet<'info> {
    #[account(mut, seeds = [b"vault"], bump = vault.bump)]
    pub vault: Account<'info, Vault>,
    
    #[account(
        mut,
        seeds = [b"user_account", user.key().as_ref()],
        bump,
        has_one = user
    )]
    pub user_account: Account<'info, UserAccount>,
    
    #[account(
        init,
        payer = user,
        space = BetRecord::LEN,
        seeds = [b"bet_record", bet_id.as_bytes()],
        bump
    )]
    pub bet_record: Account<'info, BetRecord>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SettleBet<'info> {
    #[account(mut, seeds = [b"vault"], bump = vault.bump)]
    pub vault: Account<'info, Vault>,
    
    #[account(
        mut,
        seeds = [b"user_account", bet_record.user.as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,
    
    #[account(
        mut,
        seeds = [b"bet_record", bet_record.bet_id.as_bytes()],
        bump,
        has_one = user
    )]
    pub bet_record: Account<'info, BetRecord>,
    
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct CollectFees<'info> {
    #[account(mut, seeds = [b"vault"], bump = vault.bump)]
    pub vault: Account<'info, Vault>,
    
    pub authority: Signer<'info>,
    
    #[account(mut)]
    pub vault_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub authority_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Vault {
    pub authority: Pubkey,
    pub name: String,
    pub symbol: String,
    pub total_deposits: u64,
    pub total_withdrawals: u64,
    pub total_earnings: u64,
    pub total_fees: u64,
    pub is_active: bool,
    pub bump: u8,
}

#[account]
pub struct UserAccount {
    pub user: Pubkey,
    pub total_deposited: u64,
    pub current_balance: u64,
    pub total_earnings: u64,
    pub last_deposit: i64,
    pub last_withdrawal: i64,
}

#[account]
pub struct BetRecord {
    pub bet_id: String,
    pub user: Pubkey,
    pub strategy_id: String,
    pub amount: u64,
    pub result: BetResult,
    pub profit: i64,
    pub status: BetStatus,
    pub created_at: i64,
    pub settled_at: i64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum BetResult {
    Win,
    Loss,
    Draw,
    Void,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum BetStatus {
    Pending,
    Settled,
    Cancelled,
}

impl Vault {
    pub const LEN: usize = 8 + 32 + 4 + 50 + 4 + 10 + 8 + 8 + 8 + 8 + 1 + 1;
}

impl UserAccount {
    pub const LEN: usize = 8 + 32 + 8 + 8 + 8 + 8 + 8;
}

impl BetRecord {
    pub const LEN: usize = 8 + 4 + 100 + 32 + 4 + 50 + 8 + 1 + 8 + 1 + 8 + 8 + 1;
}

#[error_code]
pub enum VaultError {
    #[msg("Insufficient balance")]
    InsufficientBalance,
    #[msg("Withdrawal cooldown not met")]
    WithdrawalCooldown,
    #[msg("Bet already settled")]
    BetAlreadySettled,
    #[msg("Unauthorized")]
    Unauthorized,
} 