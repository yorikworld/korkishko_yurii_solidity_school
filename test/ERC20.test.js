const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { ZERO_ADDRESS } = constants;

const {
    shouldBehaveLikeERC20,
    shouldBehaveLikeERC20Transfer,
    shouldBehaveLikeERC20Approve,
} = require('./ERC20.behavior');

const ERC20Mock = artifacts.require('./ERC20Mock');
const ERC20DecimalsMock = artifacts.require('./ERC20DecimalsMock');

contract('ERC20', function (accounts) {
    const [ initialHolder, recipient, anotherAccount ] = accounts;

    const name = 'KorkishkoToken';
    const symbol = 'KOR';

    const initialSupply = new BN(100);

    beforeEach(async function () {
        this.token = await ERC20Mock.new(name, symbol, initialHolder, initialSupply);
    });

    it('has a name', async function () {
        expect(await this.token.name()).to.equal(name);
    });

    it('has a symbol', async function () {
        expect(await this.token.symbol()).to.equal(symbol);
    });

    it('has 18 decimals', async function () {
        expect(await this.token.decimals()).to.be.bignumber.equal('18');
    });

    describe('set decimals', function () {
        const decimals = new BN(6);

        it('can set decimals during construction', async function () {
            const token = await ERC20DecimalsMock.new(name, symbol, decimals);
            expect(await token.decimals()).to.be.bignumber.equal(decimals);
        });
    });

    shouldBehaveLikeERC20('ERC20', initialSupply, initialHolder, recipient, anotherAccount);

    describe('_mint', function () {
        const amount = new BN(50);
        it('rejects a null account', async function () {
            await expectRevert(
                this.token.mint(ZERO_ADDRESS, amount), 'ERC20: mint to the zero address',
            );
        });

        describe('for a non zero account', function () {
            beforeEach('minting', async function () {
                const { logs } = await this.token.mint(recipient, amount);
                this.logs = logs;
            });

            it('increments totalSupply', async function () {
                const expectedSupply = initialSupply.add(amount);
                expect(await this.token.totalSupply()).to.be.bignumber.equal(expectedSupply);
            });

            it('increments recipient balance', async function () {
                expect(await this.token.balanceOf(recipient)).to.be.bignumber.equal(amount);
            });

            it('emits Transfer event', async function () {
                const event = expectEvent.inLogs(this.logs, 'Transfer', {
                    from: ZERO_ADDRESS,
                    to: recipient,
                });

                expect(event.args.value).to.be.bignumber.equal(amount);
            });
        });
    });

    describe('_transfer', function () {
        shouldBehaveLikeERC20Transfer('ERC20', initialHolder, recipient, initialSupply, function (from, to, amount) {
            return this.token.transferInternal(from, to, amount);
        });

        describe('when the sender is the zero address', function () {
            it('reverts', async function () {
                await expectRevert(this.token.transferInternal(ZERO_ADDRESS, recipient, initialSupply),
                    'ERC20: transfer from the zero address',
                );
            });
        });
    });

    describe('_approve', function () {
        shouldBehaveLikeERC20Approve('ERC20', initialHolder, recipient, initialSupply, function (owner, spender, amount) {
            return this.token.approveInternal(owner, spender, amount);
        });

        describe('when the owner is the zero address', function () {
            it('reverts', async function () {
                await expectRevert(this.token.approveInternal(ZERO_ADDRESS, recipient, initialSupply),
                    'ERC20: approve from the zero address',
                );
            });
        });
    });
});
