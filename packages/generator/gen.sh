
mkdir -p __tests__/data/gen

npx pbjs \
        --es6 \
        --no-create \
        --no-verify \
        --no-delimited \
        -t static-module \
        -w es6 \
        -o __tests__/data/gen/contract.js \
        __tests__/data/contract.proto

npx pbts \
    -o __tests__/data/gen/contract.d.ts \
    __tests__/data/gen/contract.js