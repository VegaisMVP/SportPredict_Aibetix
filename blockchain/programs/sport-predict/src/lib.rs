use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod sport_predict {
    use super::*;

    // Initialize the platform
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let platform = &mut ctx.accounts.platform;
        platform.authority = ctx.accounts.authority.key();
        platform.bump = *ctx.bumps.get("platform").unwrap();
        platform.total_users = 0;
        platform.total_bets = 0;
        platform.total_volume = 0;
        Ok(())
    }

    // Create user account
    pub fn create_user(ctx: Context<CreateUser>, username: String) -> Result<()> {
        let user = &mut ctx.accounts.user;
        let platform = &mut ctx.accounts.platform;

        user.authority = ctx.accounts.authority.key();
        user.username = username;
        user.bump = *ctx.bumps.get("user").unwrap();
        user.balance = 0;
        user.total_bets = 0;
        user.total_wins = 0;
        user.total_volume = 0;
        user.is_active = true;

        platform.total_users += 1;

        Ok(())
    }

    // Deposit funds
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let user = &mut ctx.accounts.user;
        let platform = &mut ctx.accounts.platform;

        // Transfer tokens from user to platform vault
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.user_token_account.to_account_info(),
                to: ctx.accounts.platform_vault.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        );

        token::transfer(transfer_ctx, amount)?;

        // Update user balance
        user.balance += amount;
        user.total_volume += amount;
        platform.total_volume += amount;

        // Emit deposit event
        emit!(DepositEvent {
            user: user.key(),
            amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    // Place bet
    pub fn place_bet(
        ctx: Context<PlaceBet>,
        match_id: String,
        prediction: String,
        amount: u64,
        odds: f64,
    ) -> Result<()> {
        let user = &mut ctx.accounts.user;
        let bet = &mut ctx.accounts.bet;
        let platform = &mut ctx.accounts.platform;

        require!(user.balance >= amount, SportPredictError::InsufficientBalance);
        require!(user.is_active, SportPredictError::UserInactive);

        // Create bet account
        bet.user = user.key();
        bet.match_id = match_id;
        bet.prediction = prediction;
        bet.amount = amount;
        bet.odds = odds;
        bet.potential_winnings = (amount as f64 * odds) as u64;
        bet.status = BetStatus::Pending;
        bet.bump = *ctx.bumps.get("bet").unwrap();
        bet.created_at = Clock::get()?.unix_timestamp;

        // Deduct amount from user balance
        user.balance -= amount;
        user.total_bets += 1;
        platform.total_bets += 1;

        // Emit bet placed event
        emit!(BetPlacedEvent {
            user: user.key(),
            bet: bet.key(),
            match_id: bet.match_id.clone(),
            amount,
            prediction: bet.prediction.clone(),
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    // Settle bet
    pub fn settle_bet(ctx: Context<SettleBet>, result: BetResult) -> Result<()> {
        let bet = &mut ctx.accounts.bet;
        let user = &mut ctx.accounts.user;
        let platform = &mut ctx.accounts.platform;

        require!(bet.status == BetStatus::Pending, SportPredictError::BetAlreadySettled);

        bet.result = result;
        bet.status = BetStatus::Settled;
        bet.settled_at = Clock::get()?.unix_timestamp;

        match result {
            BetResult::Win => {
                let winnings = bet.potential_winnings;
                user.balance += winnings;
                user.total_wins += 1;
                bet.winnings = winnings;

                // Emit win event
                emit!(BetWonEvent {
                    user: user.key(),
                    bet: bet.key(),
                    winnings,
                    timestamp: Clock::get()?.unix_timestamp,
                });
            }
            BetResult::Loss => {
                bet.winnings = 0;
                // Emit loss event
                emit!(BetLostEvent {
                    user: user.key(),
                    bet: bet.key(),
                    timestamp: Clock::get()?.unix_timestamp,
                });
            }
            BetResult::Draw => {
                // Return original bet amount
                user.balance += bet.amount;
                bet.winnings = bet.amount;

                // Emit draw event
                emit!(BetDrawEvent {
                    user: user.key(),
                    bet: bet.key(),
                    refund_amount: bet.amount,
                    timestamp: Clock::get()?.unix_timestamp,
                });
            }
        }

        Ok(())
    }

    // Withdraw funds
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let user = &mut ctx.accounts.user;
        let platform = &mut ctx.accounts.platform;

        require!(user.balance >= amount, SportPredictError::InsufficientBalance);
        require!(user.is_active, SportPredictError::UserInactive);

        // Transfer tokens from platform vault to user
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.platform_vault.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.platform.to_account_info(),
            },
        );

        token::transfer(transfer_ctx, amount)?;

        // Update user balance
        user.balance -= amount;
        platform.total_volume -= amount;

        // Emit withdrawal event
        emit!(WithdrawEvent {
            user: user.key(),
            amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    // Create ETF
    pub fn create_etf(
        ctx: Context<CreateETF>,
        name: String,
        description: String,
        strategy: String,
        risk_level: u8,
        min_investment: u64,
        max_investment: u64,
        annual_return: f64,
        management_fee: f64,
        performance_fee: f64,
    ) -> Result<()> {
        let etf = &mut ctx.accounts.etf;
        let manager = &mut ctx.accounts.manager;

        etf.manager = manager.key();
        etf.name = name;
        etf.description = description;
        etf.strategy = strategy;
        etf.risk_level = risk_level;
        etf.min_investment = min_investment;
        etf.max_investment = max_investment;
        etf.annual_return = annual_return;
        etf.management_fee = management_fee;
        etf.performance_fee = performance_fee;
        etf.status = ETFStatus::Active;
        etf.total_value = 0;
        etf.total_investors = 0;
        etf.current_return = 0.0;
        etf.bump = *ctx.bumps.get("etf").unwrap();
        etf.created_at = Clock::get()?.unix_timestamp;

        Ok(())
    }

    // Invest in ETF
    pub fn invest_in_etf(ctx: Context<InvestInETF>, amount: u64) -> Result<()> {
        let user = &mut ctx.accounts.user;
        let etf = &mut ctx.accounts.etf;
        let investment = &mut ctx.accounts.investment;

        require!(user.balance >= amount, SportPredictError::InsufficientBalance);
        require!(user.is_active, SportPredictError::UserInactive);
        require!(etf.status == ETFStatus::Active, SportPredictError::ETFInactive);
        require!(amount >= etf.min_investment, SportPredictError::InvestmentTooSmall);
        require!(amount <= etf.max_investment, SportPredictError::InvestmentTooLarge);

        // Create investment account
        investment.user = user.key();
        investment.etf = etf.key();
        investment.amount = amount;
        investment.shares = amount; // 1:1 ratio for simplicity
        investment.status = InvestmentStatus::Active;
        investment.bump = *ctx.bumps.get("investment").unwrap();
        investment.created_at = Clock::get()?.unix_timestamp;

        // Update user and ETF balances
        user.balance -= amount;
        etf.total_value += amount;
        etf.total_investors += 1;

        // Emit investment event
        emit!(ETFInvestmentEvent {
            user: user.key(),
            etf: etf.key(),
            amount,
            shares: investment.shares,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    // Redeem from ETF
    pub fn redeem_from_etf(ctx: Context<RedeemFromETF>, shares: u64) -> Result<()> {
        let user = &mut ctx.accounts.user;
        let etf = &mut ctx.accounts.etf;
        let investment = &mut ctx.accounts.investment;

        require!(investment.shares >= shares, SportPredictError::InsufficientShares);
        require!(investment.status == InvestmentStatus::Active, SportPredictError::InvestmentInactive);

        let redemption_amount = (shares as f64 * (etf.total_value as f64 / etf.total_investors as f64)) as u64;

        // Update investment
        investment.shares -= shares;
        if investment.shares == 0 {
            investment.status = InvestmentStatus::Redeemed;
            etf.total_investors -= 1;
        }

        // Update user and ETF balances
        user.balance += redemption_amount;
        etf.total_value -= redemption_amount;

        // Emit redemption event
        emit!(ETFRedeemEvent {
            user: user.key(),
            etf: etf.key(),
            shares,
            redemption_amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Platform::INIT_SPACE,
        seeds = [b"platform"],
        bump
    )]
    pub platform: Account<'info, Platform>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateUser<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + User::INIT_SPACE,
        seeds = [b"user", authority.key().as_ref()],
        bump
    )]
    pub user: Account<'info, User>,
    #[account(
        mut,
        seeds = [b"platform"],
        bump = platform.bump
    )]
    pub platform: Account<'info, Platform>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(
        mut,
        seeds = [b"user", authority.key().as_ref()],
        bump = user.bump
    )]
    pub user: Account<'info, User>,
    #[account(
        mut,
        seeds = [b"platform"],
        bump = platform.bump
    )]
    pub platform: Account<'info, Platform>,
    #[account(
        mut,
        seeds = [b"vault"],
        bump
    )]
    pub platform_vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct PlaceBet<'info> {
    #[account(
        mut,
        seeds = [b"user", authority.key().as_ref()],
        bump = user.bump
    )]
    pub user: Account<'info, User>,
    #[account(
        init,
        payer = authority,
        space = 8 + Bet::INIT_SPACE,
        seeds = [b"bet", user.key().as_ref(), &Clock::get()?.unix_timestamp.to_le_bytes()],
        bump
    )]
    pub bet: Account<'info, Bet>,
    #[account(
        mut,
        seeds = [b"platform"],
        bump = platform.bump
    )]
    pub platform: Account<'info, Platform>,
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SettleBet<'info> {
    #[account(
        mut,
        seeds = [b"bet", bet.user.as_ref(), &bet.created_at.to_le_bytes()],
        bump = bet.bump
    )]
    pub bet: Account<'info, Bet>,
    #[account(
        mut,
        seeds = [b"user", bet.user.as_ref()],
        bump = user.bump
    )]
    pub user: Account<'info, User>,
    #[account(
        mut,
        seeds = [b"platform"],
        bump = platform.bump
    )]
    pub platform: Account<'info, Platform>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(
        mut,
        seeds = [b"user", authority.key().as_ref()],
        bump = user.bump
    )]
    pub user: Account<'info, User>,
    #[account(
        mut,
        seeds = [b"platform"],
        bump = platform.bump
    )]
    pub platform: Account<'info, Platform>,
    #[account(
        mut,
        seeds = [b"vault"],
        bump
    )]
    pub platform_vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CreateETF<'info> {
    #[account(
        init,
        payer = manager,
        space = 8 + ETF::INIT_SPACE,
        seeds = [b"etf", manager.key().as_ref(), &Clock::get()?.unix_timestamp.to_le_bytes()],
        bump
    )]
    pub etf: Account<'info, ETF>,
    #[account(
        mut,
        seeds = [b"user", manager.key().as_ref()],
        bump = manager.bump
    )]
    pub manager: Account<'info, User>,
    #[account(mut)]
    pub manager_signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InvestInETF<'info> {
    #[account(
        mut,
        seeds = [b"user", authority.key().as_ref()],
        bump = user.bump
    )]
    pub user: Account<'info, User>,
    #[account(
        mut,
        seeds = [b"etf", etf.manager.as_ref(), &etf.created_at.to_le_bytes()],
        bump = etf.bump
    )]
    pub etf: Account<'info, ETF>,
    #[account(
        init,
        payer = authority,
        space = 8 + Investment::INIT_SPACE,
        seeds = [b"investment", user.key().as_ref(), etf.key().as_ref()],
        bump
    )]
    pub investment: Account<'info, Investment>,
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RedeemFromETF<'info> {
    #[account(
        mut,
        seeds = [b"user", authority.key().as_ref()],
        bump = user.bump
    )]
    pub user: Account<'info, User>,
    #[account(
        mut,
        seeds = [b"etf", etf.manager.as_ref(), &etf.created_at.to_le_bytes()],
        bump = etf.bump
    )]
    pub etf: Account<'info, ETF>,
    #[account(
        mut,
        seeds = [b"investment", user.key().as_ref(), etf.key().as_ref()],
        bump = investment.bump
    )]
    pub investment: Account<'info, Investment>,
    pub authority: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Platform {
    pub authority: Pubkey,
    pub bump: u8,
    pub total_users: u64,
    pub total_bets: u64,
    pub total_volume: u64,
}

#[account]
#[derive(InitSpace)]
pub struct User {
    pub authority: Pubkey,
    pub username: String,
    pub bump: u8,
    pub balance: u64,
    pub total_bets: u64,
    pub total_wins: u64,
    pub total_volume: u64,
    pub is_active: bool,
}

#[account]
#[derive(InitSpace)]
pub struct Bet {
    pub user: Pubkey,
    pub match_id: String,
    pub prediction: String,
    pub amount: u64,
    pub odds: f64,
    pub potential_winnings: u64,
    pub winnings: Option<u64>,
    pub status: BetStatus,
    pub result: Option<BetResult>,
    pub bump: u8,
    pub created_at: i64,
    pub settled_at: Option<i64>,
}

#[account]
#[derive(InitSpace)]
pub struct ETF {
    pub manager: Pubkey,
    pub name: String,
    pub description: String,
    pub strategy: String,
    pub risk_level: u8,
    pub min_investment: u64,
    pub max_investment: u64,
    pub annual_return: f64,
    pub management_fee: f64,
    pub performance_fee: f64,
    pub status: ETFStatus,
    pub total_value: u64,
    pub total_investors: u64,
    pub current_return: f64,
    pub bump: u8,
    pub created_at: i64,
}

#[account]
#[derive(InitSpace)]
pub struct Investment {
    pub user: Pubkey,
    pub etf: Pubkey,
    pub amount: u64,
    pub shares: u64,
    pub status: InvestmentStatus,
    pub bump: u8,
    pub created_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum BetStatus {
    Pending,
    Settled,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum BetResult {
    Win,
    Loss,
    Draw,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ETFStatus {
    Active,
    Paused,
    Closed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum InvestmentStatus {
    Active,
    Redeemed,
    Cancelled,
}

#[error_code]
pub enum SportPredictError {
    #[msg("Insufficient balance")]
    InsufficientBalance,
    #[msg("User is inactive")]
    UserInactive,
    #[msg("Bet already settled")]
    BetAlreadySettled,
    #[msg("ETF is inactive")]
    ETFInactive,
    #[msg("Investment amount too small")]
    InvestmentTooSmall,
    #[msg("Investment amount too large")]
    InvestmentTooLarge,
    #[msg("Insufficient shares")]
    InsufficientShares,
    #[msg("Investment is inactive")]
    InvestmentInactive,
}

// Events
#[event]
pub struct DepositEvent {
    pub user: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct WithdrawEvent {
    pub user: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct BetPlacedEvent {
    pub user: Pubkey,
    pub bet: Pubkey,
    pub match_id: String,
    pub amount: u64,
    pub prediction: String,
    pub timestamp: i64,
}

#[event]
pub struct BetWonEvent {
    pub user: Pubkey,
    pub bet: Pubkey,
    pub winnings: u64,
    pub timestamp: i64,
}

#[event]
pub struct BetLostEvent {
    pub user: Pubkey,
    pub bet: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct BetDrawEvent {
    pub user: Pubkey,
    pub bet: Pubkey,
    pub refund_amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct ETFInvestmentEvent {
    pub user: Pubkey,
    pub etf: Pubkey,
    pub amount: u64,
    pub shares: u64,
    pub timestamp: i64,
}

#[event]
pub struct ETFRedeemEvent {
    pub user: Pubkey,
    pub etf: Pubkey,
    pub shares: u64,
    pub redemption_amount: u64,
    pub timestamp: i64,
} 