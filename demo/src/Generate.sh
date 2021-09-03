FOLDER=../../examples

for file in example-antigen example-recovery example-pass example-vaccination
do
    echo "== $file =="

    node demo.js \
        --credential $FOLDER/$file.json \
        --vc $FOLDER/$file-vc.json \
        --url $FOLDER/$file-vc.txt \
        --qrcode $FOLDER/$file-vc.png
done
