FOLDER=../../examples

for file in example-antigen example-recovery example-pass example-vaccination
do
    echo "== $file =="

    [ -f $FOLDER/$file-vc.json ] && continue

    node demo.js \
        --credential $FOLDER/$file.json \
        --vc $FOLDER/$file-vc.json \
        --uri $FOLDER/$file-vc.txt \
        --qrcode $FOLDER/$file-vc.png
done
