import {ConnectAdditionalRequest , TonProofItemReplySuccess, Account} from '@tonconnect/sdk'

class TonProofApi {
    private _host = 'https://demo.tonconnect.dev/';
    public access_token: string | null = null;

    async generatePayload(): Promise<ConnectAdditionalRequest | undefined>{
        try {
            const response = await (await fetch(`${this._host}/ton-proof/generatePayload`,{ method:'POST'})).json();
            return {tonProof: response.payload}
        } catch (error) {
            console.log(error);
            return
        }
    }

    async checkProof(proof: TonProofItemReplySuccess, account: Account){
        const bodyRequest = {
            address: account.address, // user's address
            network: account.chain, // "-239" for mainnet and "-1" for testnet
            proof: {
                ...proof,
                state_init: account.walletStateInit
            }
        };
        try {
            
            const response = await (await fetch(`${this._host}/ton-proof/checkProof`,{ method:'POST', body: JSON.stringify(bodyRequest)})).json()
            if(response?.token){
                this.access_token = response?.token 
            }
        } catch (error) {
            console.log(error);
            
        }
    }
    async getAccountInfo(account: Account){
        return await (await fetch(`${this._host}/dapp/getAccountInfo?${account.chain}`,{ headers: {Authorization: `Bearer ${this.access_token}`, 'Content-Type': 'application/json'} })).json()
    }

}
export const tonProofApi = new TonProofApi()