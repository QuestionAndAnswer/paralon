
mkdir -p data/gen

npx pbjs \
        --es6 \
        --no-create \
        --no-verify \
        --no-delimited \
        -t static-module \
        -w es6 \
        -o data/gen/contract.js \
        data/contract.proto

npx pbts \
    -o data/gen/contract.d.ts \
    data/gen/contract.js

npx prln \
    --proto data/contract.proto \
    --pout data/gen/contract.js \
    --client data/gen/prln-client.js