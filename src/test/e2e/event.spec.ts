import { config } from 'dotenv';

config();
import { CrUSDCMonitorSingleton } from '../../service/token/crusdc/monitor';

jest.setTimeout(30000);
describe('test Mint event,', () => {
  const consoleSpy = jest.spyOn(global.console, 'info');
  afterEach(() => {
    consoleSpy.mockReset();
  });
  it('should print info log', async () => {
    const crusdc = CrUSDCMonitorSingleton.getInstance();
    await crusdc.ready();
    await crusdc.fetchEvent(12901726);
    const expected = '\r\n' + '#12901726: 0xe58fa35e9f13771b81cc13c2a706c4a3c0246496dccd0f664b97ab6e19082e60' + '\r\n' +
      '0x6f79BC4329BC1d5a387077fc999Aff8CA0E3D0f7 Mint 175540648570805 crUSDC with 39608120772 USDC' + '\r\n';
    expect(consoleSpy).toBeCalledTimes(1);
    expect(consoleSpy).toHaveBeenLastCalledWith(expected);
  });
  it('should not print info log', async () => {
    const crusdc = CrUSDCMonitorSingleton.getInstance();
    await crusdc.ready();
    await crusdc.fetchEvent(12901727);
    expect(consoleSpy).toBeCalledTimes(0);
  });
});
describe('test Redeem event,', () => {
  const consoleSpy = jest.spyOn(global.console, 'info');
  afterEach(() => {
    consoleSpy.mockReset();
  });
  it('should print info log', async () => {
    const crusdc = CrUSDCMonitorSingleton.getInstance();
    await crusdc.ready();
    await crusdc.fetchEvent(12901617);
    const expected = '\r\n' + '#12901617: 0xa96ee04043c3459f4461f64b51355370991f8495d2b58db0583553a092f4c469' + '\r\n' +
      '0x272b099c8CBECCc8cD366Ddb15b6A549673Df82e Redeem 536864614312 USDC, burn 2379354837174145 crUSDC' + '\r\n';
    expect(consoleSpy).toBeCalledTimes(1);
    expect(consoleSpy).toHaveBeenLastCalledWith(expected);
  });
  it('should not print info log', async () => {
    const crusdc = CrUSDCMonitorSingleton.getInstance();
    await crusdc.ready();
    await crusdc.fetchEvent(12901618);
    expect(consoleSpy).toBeCalledTimes(0);
  });
});
describe('test Borrow event,', () => {
  const consoleSpy = jest.spyOn(global.console, 'info');
  afterEach(() => {
    consoleSpy.mockReset();
  });
  it('should print info log', async () => {
    const crusdc = CrUSDCMonitorSingleton.getInstance();
    await crusdc.ready();
    await crusdc.fetchEvent(12901627);
    const expected = '\r\n' + '#12901627: 0xcedb57a25f2b0aac31e81727097f80117dde96273055f3c06bf86820901949a8' + '\r\n' +
      '0x686BCd4c95b06a583Ec8896381F0266A0Aa7745c Borrow 1000000 USDC' + '\r\n';
    expect(consoleSpy).toBeCalledTimes(1);
    expect(consoleSpy).toHaveBeenLastCalledWith(expected);
  });
  it('should not print info log', async () => {
    const crusdc = CrUSDCMonitorSingleton.getInstance();
    await crusdc.ready();
    await crusdc.fetchEvent(129016278);
    expect(consoleSpy).toBeCalledTimes(0);
  });
});
describe('test RepayBorrow event,', () => {
  const consoleSpy = jest.spyOn(global.console, 'info');
  afterEach(() => {
    consoleSpy.mockReset();
  });
  it('should print info log', async () => {
    const crusdc = CrUSDCMonitorSingleton.getInstance();
    await crusdc.ready();
    await crusdc.fetchEvent(12901599);
    const expected = '\r\n' + '#12901599: 0x0826c4767aa637d8077aad517908c41b7b316765e1ecf3f92d6bfd8d5b6ed385' + '\r\n' +
      '0x686BCd4c95b06a583Ec8896381F0266A0Aa7745c RepayBorrow 1000000 USDC for 0x686BCd4c95b06a583Ec8896381F0266A0Aa7745c' + '\r\n';
    expect(consoleSpy).toBeCalledTimes(1);
    expect(consoleSpy).toHaveBeenLastCalledWith(expected);
  });
  it('should not print info log', async () => {
    const crusdc = CrUSDCMonitorSingleton.getInstance();
    await crusdc.ready();
    await crusdc.fetchEvent(12901600);
    expect(consoleSpy).toBeCalledTimes(0);
  });
});