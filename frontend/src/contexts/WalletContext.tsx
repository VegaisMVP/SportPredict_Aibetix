import React, { createContext, useContext, useState, useEffect } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'

interface WalletContextType {
  connected: boolean
  publicKey: PublicKey | null
  connect: () => Promise<void>
  disconnect: () => void
  balance: number | null
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connected, setConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)
  const [balance, setBalance] = useState<number | null>(null)

  const network = WalletAdapterNetwork.Devnet
  const endpoint = 'https://api.devnet.solana.com'
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ]

  const connection = new Connection(endpoint)

  useEffect(() => {
    if (publicKey) {
      fetchBalance()
    }
  }, [publicKey])

  const fetchBalance = async () => {
    if (!publicKey) return
    try {
      const balance = await connection.getBalance(publicKey)
      setBalance(balance / 1e9) // Convert lamports to SOL
    } catch (error) {
      console.error('Error fetching balance:', error)
    }
  }

  const connect = async () => {
    // This would be handled by the wallet adapter
    setConnected(true)
  }

  const disconnect = () => {
    setConnected(false)
    setPublicKey(null)
    setBalance(null)
  }

  return (
    <SolanaWalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <WalletContext.Provider value={{ connected, publicKey, connect, disconnect, balance }}>
          {children}
        </WalletContext.Provider>
      </WalletModalProvider>
    </SolanaWalletProvider>
  )
} 