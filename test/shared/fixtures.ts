import { BigNumber } from 'ethers'
import { ethers } from 'hardhat'
import { MockTimeLyzoV3Pool } from '../../typechain/MockTimeLyzoV3Pool'
import { TestERC20 } from '../../typechain/TestERC20'
import { LyzoV3Factory } from '../../typechain/LyzoV3Factory'
import { TestLyzoV3Callee } from '../../typechain/TestLyzoV3Callee'
import { TestLyzoV3Router } from '../../typechain/TestLyzoV3Router'
import { MockTimeLyzoV3PoolDeployer } from '../../typechain/MockTimeLyzoV3PoolDeployer'

import { Fixture } from 'ethereum-waffle'

interface FactoryFixture {
  factory: LyzoV3Factory
}

async function factoryFixture(): Promise<FactoryFixture> {
  const factoryFactory = await ethers.getContractFactory('LyzoV3Factory')
  const factory = (await factoryFactory.deploy()) as LyzoV3Factory
  return { factory }
}

interface TokensFixture {
  token0: TestERC20
  token1: TestERC20
  token2: TestERC20
}

async function tokensFixture(): Promise<TokensFixture> {
  const tokenFactory = await ethers.getContractFactory('TestERC20')
  const tokenA = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20
  const tokenB = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20
  const tokenC = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20

  const [token0, token1, token2] = [tokenA, tokenB, tokenC].sort((tokenA, tokenB) =>
    tokenA.address.toLowerCase() < tokenB.address.toLowerCase() ? -1 : 1
  )

  return { token0, token1, token2 }
}

type TokensAndFactoryFixture = FactoryFixture & TokensFixture

interface PoolFixture extends TokensAndFactoryFixture {
  swapTargetCallee: TestLyzoV3Callee
  swapTargetRouter: TestLyzoV3Router
  createPool(
    fee: number,
    tickSpacing: number,
    firstToken?: TestERC20,
    secondToken?: TestERC20
  ): Promise<MockTimeLyzoV3Pool>
}

// Monday, October 5, 2020 9:00:00 AM GMT-05:00
export const TEST_POOL_START_TIME = 1601906400

export const poolFixture: Fixture<PoolFixture> = async function (): Promise<PoolFixture> {
  const { factory } = await factoryFixture()
  const { token0, token1, token2 } = await tokensFixture()

  const MockTimeLyzoV3PoolDeployerFactory = await ethers.getContractFactory('MockTimeLyzoV3PoolDeployer')
  const MockTimeLyzoV3PoolFactory = await ethers.getContractFactory('MockTimeLyzoV3Pool')

  const calleeContractFactory = await ethers.getContractFactory('TestLyzoV3Callee')
  const routerContractFactory = await ethers.getContractFactory('TestLyzoV3Router')

  const swapTargetCallee = (await calleeContractFactory.deploy()) as TestLyzoV3Callee
  const swapTargetRouter = (await routerContractFactory.deploy()) as TestLyzoV3Router

  return {
    token0,
    token1,
    token2,
    factory,
    swapTargetCallee,
    swapTargetRouter,
    createPool: async (fee, tickSpacing, firstToken = token0, secondToken = token1) => {
      const mockTimePoolDeployer = (await MockTimeLyzoV3PoolDeployerFactory.deploy()) as MockTimeLyzoV3PoolDeployer
      const tx = await mockTimePoolDeployer.deploy(
        factory.address,
        firstToken.address,
        secondToken.address,
        fee,
        tickSpacing
      )

      const receipt = await tx.wait()
      const poolAddress = receipt.events?.[0].args?.pool as string
      return MockTimeLyzoV3PoolFactory.attach(poolAddress) as MockTimeLyzoV3Pool
    },
  }
}
