import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Btecontracts } from "../target/types/btecontracts";
import {
  TOKEN_PROGRAM_ID,
  createMint,
  createAccount,
  mintTo,
} from "@solana/spl-token";
import { expect } from "chai";

// Add these imports for TypeScript to recognize test functions
import "mocha";

describe("bte-contracts", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.BteContracts as Program<Btecontracts>;
  
  let mintPda: anchor.web3.PublicKey;
  let userTokenAccount: anchor.web3.PublicKey;
  let poolAccount: anchor.web3.PublicKey;
  let teamWallet: anchor.web3.PublicKey;

  before(async () => {
    // Use provider.wallet instead of provider.wallet.payer
    mintPda = await createMint(
      provider.connection,
      provider.wallet as any, // Type assertion for compatibility
      provider.wallet.publicKey,
      null,
      9
    );

    userTokenAccount = await createAccount(
      provider.connection,
      provider.wallet as any, // Type assertion for compatibility
      mintPda,
      provider.wallet.publicKey
    );

    poolAccount = await createAccount(
      provider.connection,
      provider.wallet as any, // Type assertion for compatibility
      mintPda,
      provider.wallet.publicKey
    );

    teamWallet = await createAccount(
      provider.connection,
      provider.wallet as any, // Type assertion for compatibility
      mintPda,
      provider.wallet.publicKey
    );
  });

  it("Initializes the mint", async () => {
    try {
      await program.methods
        .initializeMint()
        .accounts({
          mint: mintPda,
          authority: provider.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const mintInfo = await provider.connection.getAccountInfo(mintPda);
      expect(mintInfo).to.not.be.null;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  });

  it("Can burn tokens", async () => {
    await mintTo(
      provider.connection,
      provider.wallet as any, // Type assertion for compatibility
      mintPda,
      userTokenAccount,
      provider.wallet.publicKey,
      1000000000
    );

    try {
      await program.methods
        .burnTokens(new anchor.BN(100000000))
        .accounts({
          user: provider.wallet.publicKey,
          tokenMint: mintPda,
          userTokenAccount: userTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  });
});
