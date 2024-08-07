import TonConnect from '@tonconnect/sdk';

export const connector = new TonConnect({
    manifestUrl: 'https://pashaby94.github.io/manifest_file/pahas_manifest.json',
});
export const isRestored = connector.restoreConnection();
isRestored.then(console.log);
console.log(isRestored);
