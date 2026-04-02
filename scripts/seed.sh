#!/bin/bash
set -e

API_URL=$(aws cloudformation describe-stacks \
  --stack-name AccountServiceStack \
  --region eu-north-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text)

post() {
  curl -sf -X POST "$API_URL/accounts" \
    -H "Content-Type: application/json" \
    -d "$1"
  echo
}

# Henry Davis (274908b0) — 3 accounts
post '{"name":"Salary Account","iban":"DK9400400000000001","currency":"DKK","customerId":"274908b0-fc0e-40bf-87fa-ba4df6d4d922"}'
post '{"name":"Savings Account","iban":"DK9400400000000002","currency":"DKK","customerId":"274908b0-fc0e-40bf-87fa-ba4df6d4d922"}'
post '{"name":"Holiday Fund","iban":"DK9400400000000003","currency":"DKK","customerId":"274908b0-fc0e-40bf-87fa-ba4df6d4d922"}'

# Diana Carter (ed44fa5c) — 2 accounts
post '{"name":"Main Account","iban":"DK9409100000000004","currency":"DKK","customerId":"ed44fa5c-1ec6-4b7d-a62a-19bf6ed7f449"}'
post '{"name":"Savings","iban":"DK9409100000000005","currency":"DKK","customerId":"ed44fa5c-1ec6-4b7d-a62a-19bf6ed7f449"}'

# Penny Morris (10f242c0) — 1 account
post '{"name":"Everyday Account","iban":"DK9400400000000006","currency":"DKK","customerId":"10f242c0-5143-4ee2-9997-b783e60bfa90"}'

# Zoe Green (0c151f2b) — 4 accounts
post '{"name":"Salary Account","iban":"DK9415510000000007","currency":"DKK","customerId":"0c151f2b-cf70-4cf8-b0a5-e16bd676e4e7"}'
post '{"name":"Savings","iban":"DK9415510000000008","currency":"DKK","customerId":"0c151f2b-cf70-4cf8-b0a5-e16bd676e4e7"}'
post '{"name":"Investment Account","iban":"DK9415510000000009","currency":"EUR","customerId":"0c151f2b-cf70-4cf8-b0a5-e16bd676e4e7"}'
post '{"name":"Holiday Fund","iban":"DK9415510000000010","currency":"DKK","customerId":"0c151f2b-cf70-4cf8-b0a5-e16bd676e4e7"}'

# Nina Collins (ac33a217) — 4 accounts
post '{"name":"Salary Account","iban":"DK9420000000000011","currency":"DKK","customerId":"ac33a217-cb07-4b02-ab83-324b3bc3f98a"}'
post '{"name":"Savings","iban":"DK9420000000000012","currency":"DKK","customerId":"ac33a217-cb07-4b02-ab83-324b3bc3f98a"}'
post '{"name":"Emergency Fund","iban":"DK9420000000000013","currency":"DKK","customerId":"ac33a217-cb07-4b02-ab83-324b3bc3f98a"}'
post '{"name":"Investment Account","iban":"DK9420000000000014","currency":"EUR","customerId":"ac33a217-cb07-4b02-ab83-324b3bc3f98a"}'

# Tara Hall (d088dc44) — 0 accounts

# Mike Edwards (f9eec4f2) — 2 accounts
post '{"name":"Main Account","iban":"DK9430010000000015","currency":"DKK","customerId":"f9eec4f2-9950-401c-997e-b91cbec3b843"}'
post '{"name":"Savings Account","iban":"DK9430010000000016","currency":"DKK","customerId":"f9eec4f2-9950-401c-997e-b91cbec3b843"}'

# Quincy Rogers (7ee24f23) — 3 accounts
post '{"name":"Salary Account","iban":"DK9400400000000017","currency":"DKK","customerId":"7ee24f23-fa9a-400c-a9c6-0f3a22f88106"}'
post '{"name":"Savings","iban":"DK9400400000000018","currency":"DKK","customerId":"7ee24f23-fa9a-400c-a9c6-0f3a22f88106"}'
post '{"name":"Travel Fund","iban":"DK9400400000000019","currency":"DKK","customerId":"7ee24f23-fa9a-400c-a9c6-0f3a22f88106"}'

# Ulric Bell (db4ca9fe) — 1 account
post '{"name":"Current Account","iban":"DK9460000000000020","currency":"DKK","customerId":"db4ca9fe-790c-4014-a769-a1032e8155e3"}'

# Walter Bailey (0c5a7bc1) — 4 accounts
post '{"name":"Business Account","iban":"DK9400400000000021","currency":"DKK","customerId":"0c5a7bc1-e865-43bc-a01d-f7920570383f"}'
post '{"name":"Personal Savings","iban":"DK9400400000000022","currency":"DKK","customerId":"0c5a7bc1-e865-43bc-a01d-f7920570383f"}'
post '{"name":"Investment Account","iban":"DK9400400000000023","currency":"USD","customerId":"0c5a7bc1-e865-43bc-a01d-f7920570383f"}'
post '{"name":"Emergency Fund","iban":"DK9400400000000024","currency":"DKK","customerId":"0c5a7bc1-e865-43bc-a01d-f7920570383f"}'

# Ethan Mitchell (6c0744cc) — 2 accounts
post '{"name":"Main Account","iban":"DK9409100000000025","currency":"DKK","customerId":"6c0744cc-7b16-482d-96f3-5d8807a6331b"}'
post '{"name":"Savings","iban":"DK9409100000000026","currency":"DKK","customerId":"6c0744cc-7b16-482d-96f3-5d8807a6331b"}'

# Rosa Reed (a590db48) — 3 accounts
post '{"name":"Salary Account","iban":"DK9415510000000027","currency":"DKK","customerId":"a590db48-2d9c-4549-95ec-b649e5a04464"}'
post '{"name":"Holiday Savings","iban":"DK9415510000000028","currency":"DKK","customerId":"a590db48-2d9c-4549-95ec-b649e5a04464"}'
post '{"name":"Emergency Fund","iban":"DK9415510000000029","currency":"DKK","customerId":"a590db48-2d9c-4549-95ec-b649e5a04464"}'

# Xander Wright (22898c93) — 4 accounts
post '{"name":"Main Account","iban":"DK9400400000000030","currency":"DKK","customerId":"22898c93-f628-4109-8c3c-344bcd51deda"}'
post '{"name":"Savings","iban":"DK9400400000000031","currency":"DKK","customerId":"22898c93-f628-4109-8c3c-344bcd51deda"}'
post '{"name":"Business Account","iban":"DK9400400000000032","currency":"DKK","customerId":"22898c93-f628-4109-8c3c-344bcd51deda"}'
post '{"name":"Investment Account","iban":"DK9400400000000033","currency":"EUR","customerId":"22898c93-f628-4109-8c3c-344bcd51deda"}'

# Kevin Parker (a4c8490e) — 2 accounts
post '{"name":"Salary Account","iban":"DK9420000000000034","currency":"DKK","customerId":"a4c8490e-f871-464b-a2d6-0b6e6a18455a"}'
post '{"name":"Savings Account","iban":"DK9420000000000035","currency":"DKK","customerId":"a4c8490e-f871-464b-a2d6-0b6e6a18455a"}'

# Jack Moore (836ab604) — 3 accounts
post '{"name":"Main Account","iban":"DK9430010000000036","currency":"DKK","customerId":"836ab604-c076-410b-8c24-9b9aebb980f9"}'
post '{"name":"Savings","iban":"DK9430010000000037","currency":"DKK","customerId":"836ab604-c076-410b-8c24-9b9aebb980f9"}'
post '{"name":"Emergency Fund","iban":"DK9430010000000038","currency":"DKK","customerId":"836ab604-c076-410b-8c24-9b9aebb980f9"}'

# Noah Jackson (08d881b0) — 0 accounts

# Karen Taylor (70a8f648) — 2 accounts
post '{"name":"Everyday Account","iban":"DK9400400000000039","currency":"DKK","customerId":"70a8f648-c00a-45d5-92c0-513c38949968"}'
post '{"name":"Savings","iban":"DK9400400000000040","currency":"DKK","customerId":"70a8f648-c00a-45d5-92c0-513c38949968"}'

# Vera Murphy (08e07cbc) — 4 accounts
post '{"name":"Salary Account","iban":"DK9490200000000041","currency":"DKK","customerId":"08e07cbc-026d-43b9-8010-8addb5c8d30d"}'
post '{"name":"Savings","iban":"DK9490200000000042","currency":"DKK","customerId":"08e07cbc-026d-43b9-8010-8addb5c8d30d"}'
post '{"name":"Holiday Fund","iban":"DK9490200000000043","currency":"DKK","customerId":"08e07cbc-026d-43b9-8010-8addb5c8d30d"}'
post '{"name":"Emergency Fund","iban":"DK9490200000000044","currency":"DKK","customerId":"08e07cbc-026d-43b9-8010-8addb5c8d30d"}'

# Uma Allen (81b8a0cc) — 3 accounts
post '{"name":"Main Account","iban":"DK9400400000000045","currency":"DKK","customerId":"81b8a0cc-b48c-4038-a5fc-fc1ad6c09da6"}'
post '{"name":"Savings","iban":"DK9400400000000046","currency":"DKK","customerId":"81b8a0cc-b48c-4038-a5fc-fc1ad6c09da6"}'
post '{"name":"Investment Account","iban":"DK9400400000000047","currency":"EUR","customerId":"81b8a0cc-b48c-4038-a5fc-fc1ad6c09da6"}'

# Steve Cook (98e22e65) — 2 accounts
post '{"name":"Salary Account","iban":"DK9409100000000048","currency":"DKK","customerId":"98e22e65-38fd-419e-8f4a-57aae0171930"}'
post '{"name":"Savings","iban":"DK9409100000000049","currency":"DKK","customerId":"98e22e65-38fd-419e-8f4a-57aae0171930"}'

# Bella Adams (f228eaaa) — 1 account
post '{"name":"Main Account","iban":"DK9415510000000050","currency":"DKK","customerId":"f228eaaa-c2df-413d-8152-acf59d3e66b1"}'

# Rachel Lee (392b5556) — 3 accounts
post '{"name":"Salary Account","iban":"DK9420000000000051","currency":"DKK","customerId":"392b5556-2fed-499c-9d61-bd6a690e1f63"}'
post '{"name":"Savings","iban":"DK9420000000000052","currency":"DKK","customerId":"392b5556-2fed-499c-9d61-bd6a690e1f63"}'
post '{"name":"Holiday Fund","iban":"DK9420000000000053","currency":"DKK","customerId":"392b5556-2fed-499c-9d61-bd6a690e1f63"}'

# Sam Walker (7aea2d96) — 4 accounts
post '{"name":"Main Account","iban":"DK9430010000000054","currency":"DKK","customerId":"7aea2d96-c7da-4175-b026-5439ad584ff0"}'
post '{"name":"Savings","iban":"DK9430010000000055","currency":"DKK","customerId":"7aea2d96-c7da-4175-b026-5439ad584ff0"}'
post '{"name":"Business Account","iban":"DK9430010000000056","currency":"DKK","customerId":"7aea2d96-c7da-4175-b026-5439ad584ff0"}'
post '{"name":"Investment Account","iban":"DK9430010000000057","currency":"EUR","customerId":"7aea2d96-c7da-4175-b026-5439ad584ff0"}'

# Julia Campbell (a0c38545) — 2 accounts
post '{"name":"Main Account","iban":"DK9460000000000058","currency":"DKK","customerId":"a0c38545-4130-4217-94d1-11e7919a5bab"}'
post '{"name":"Savings Account","iban":"DK9460000000000059","currency":"DKK","customerId":"a0c38545-4130-4217-94d1-11e7919a5bab"}'

# Mia Thomas (d3905571) — 3 accounts
post '{"name":"Salary Account","iban":"DK9400400000000060","currency":"DKK","customerId":"d3905571-908f-48c6-9760-bb32695333ad"}'
post '{"name":"Savings","iban":"DK9400400000000061","currency":"DKK","customerId":"d3905571-908f-48c6-9760-bb32695333ad"}'
post '{"name":"Kids Education Fund","iban":"DK9400400000000062","currency":"DKK","customerId":"d3905571-908f-48c6-9760-bb32695333ad"}'

# Ivan Phillips (f4b8a6d8) — 0 accounts

# Victor Young (f2b09b37) — 2 accounts
post '{"name":"Main Account","iban":"DK9490200000000063","currency":"DKK","customerId":"f2b09b37-f179-4d42-ab81-c21db48d991a"}'
post '{"name":"Savings","iban":"DK9490200000000064","currency":"DKK","customerId":"f2b09b37-f179-4d42-ab81-c21db48d991a"}'

# Aaron Baker (f45b32c9) — 4 accounts
post '{"name":"Salary Account","iban":"DK9400400000000065","currency":"DKK","customerId":"f45b32c9-43f0-4126-9941-e25bae869586"}'
post '{"name":"Savings","iban":"DK9400400000000066","currency":"DKK","customerId":"f45b32c9-43f0-4126-9941-e25bae869586"}'
post '{"name":"Investment Account","iban":"DK9400400000000067","currency":"USD","customerId":"f45b32c9-43f0-4126-9941-e25bae869586"}'
post '{"name":"Emergency Fund","iban":"DK9400400000000068","currency":"DKK","customerId":"f45b32c9-43f0-4126-9941-e25bae869586"}'

# Isla Wilson (d6222c79) — 3 accounts
post '{"name":"Main Account","iban":"DK9409100000000069","currency":"DKK","customerId":"d6222c79-b2bf-4538-8904-0b25841af675"}'
post '{"name":"Savings","iban":"DK9409100000000070","currency":"DKK","customerId":"d6222c79-b2bf-4538-8904-0b25841af675"}'
post '{"name":"Holiday Fund","iban":"DK9409100000000071","currency":"DKK","customerId":"d6222c79-b2bf-4538-8904-0b25841af675"}'

# Hannah Turner (a5a0ebb8) — 1 account
post '{"name":"Main Account","iban":"DK9415510000000072","currency":"DKK","customerId":"a5a0ebb8-d389-4401-85a9-fd35b3b5389e"}'

# Laura Evans (5c17be9b) — 2 accounts
post '{"name":"Everyday Account","iban":"DK9420000000000073","currency":"DKK","customerId":"5c17be9b-ecfe-4f10-9214-30f57fd1ec5a"}'
post '{"name":"Savings","iban":"DK9420000000000074","currency":"DKK","customerId":"5c17be9b-ecfe-4f10-9214-30f57fd1ec5a"}'

# George Roberts (8a927f54) — 3 accounts
post '{"name":"Salary Account","iban":"DK9400400000000075","currency":"DKK","customerId":"8a927f54-433b-47f9-9210-c21bc1ae0dca"}'
post '{"name":"Savings","iban":"DK9400400000000076","currency":"DKK","customerId":"8a927f54-433b-47f9-9210-c21bc1ae0dca"}'
post '{"name":"Retirement Fund","iban":"DK9400400000000077","currency":"DKK","customerId":"8a927f54-433b-47f9-9210-c21bc1ae0dca"}'

# Quinn Thompson (884ca1f3) — 4 accounts
post '{"name":"Main Account","iban":"DK9430010000000078","currency":"DKK","customerId":"884ca1f3-81c9-4e3b-985b-3f83aec1dda8"}'
post '{"name":"Savings","iban":"DK9430010000000079","currency":"DKK","customerId":"884ca1f3-81c9-4e3b-985b-3f83aec1dda8"}'
post '{"name":"Investment Account","iban":"DK9430010000000080","currency":"EUR","customerId":"884ca1f3-81c9-4e3b-985b-3f83aec1dda8"}'
post '{"name":"Emergency Fund","iban":"DK9430010000000081","currency":"DKK","customerId":"884ca1f3-81c9-4e3b-985b-3f83aec1dda8"}'

# Carol White (1f13ed02) — 2 accounts
post '{"name":"Main Account","iban":"DK9460000000000082","currency":"DKK","customerId":"1f13ed02-8a7c-4c6f-bb5a-19857f5f8c47"}'
post '{"name":"Savings","iban":"DK9460000000000083","currency":"DKK","customerId":"1f13ed02-8a7c-4c6f-bb5a-19857f5f8c47"}'

# Tracy Morgan (22ef5b82) — 3 accounts
post '{"name":"Salary Account","iban":"DK9490200000000084","currency":"DKK","customerId":"22ef5b82-f3a1-4814-8d89-b35c3d1b29f4"}'
post '{"name":"Savings","iban":"DK9490200000000085","currency":"DKK","customerId":"22ef5b82-f3a1-4814-8d89-b35c3d1b29f4"}'
post '{"name":"Holiday Fund","iban":"DK9490200000000086","currency":"DKK","customerId":"22ef5b82-f3a1-4814-8d89-b35c3d1b29f4"}'

# Yara Scott (be5de46d) — 0 accounts

# Liam Anderson (582d9b40) — 2 accounts
post '{"name":"Main Account","iban":"DK9400400000000087","currency":"DKK","customerId":"582d9b40-d34d-4b3d-9a8d-7c5407a7a250"}'
post '{"name":"Savings","iban":"DK9400400000000088","currency":"DKK","customerId":"582d9b40-d34d-4b3d-9a8d-7c5407a7a250"}'

# Oscar Stewart (7af8e2d2) — 4 accounts
post '{"name":"Salary Account","iban":"DK9409100000000089","currency":"DKK","customerId":"7af8e2d2-f044-4203-9d8e-d7c80a983908"}'
post '{"name":"Savings","iban":"DK9409100000000090","currency":"DKK","customerId":"7af8e2d2-f044-4203-9d8e-d7c80a983908"}'
post '{"name":"Business Account","iban":"DK9409100000000091","currency":"DKK","customerId":"7af8e2d2-f044-4203-9d8e-d7c80a983908"}'
post '{"name":"Investment Account","iban":"DK9409100000000092","currency":"EUR","customerId":"7af8e2d2-f044-4203-9d8e-d7c80a983908"}'

# Fiona Perez (42769efd) — 1 account
post '{"name":"Main Account","iban":"DK9415510000000093","currency":"DKK","customerId":"42769efd-40e7-48af-8b52-37f4d1a672b8"}'

# Olivia Harris (972539aa) — 4 accounts
post '{"name":"Salary Account","iban":"DK9420000000000094","currency":"DKK","customerId":"972539aa-5860-4f9c-b30e-95291ebde473"}'
post '{"name":"Savings","iban":"DK9420000000000095","currency":"DKK","customerId":"972539aa-5860-4f9c-b30e-95291ebde473"}'
post '{"name":"Investment Account","iban":"DK9420000000000096","currency":"USD","customerId":"972539aa-5860-4f9c-b30e-95291ebde473"}'
post '{"name":"Emergency Fund","iban":"DK9420000000000097","currency":"DKK","customerId":"972539aa-5860-4f9c-b30e-95291ebde473"}'

# Wendy King (130d6b63) — 3 accounts
post '{"name":"Main Account","iban":"DK9430010000000098","currency":"DKK","customerId":"130d6b63-5137-49b2-9013-5b74dc4ea154"}'
post '{"name":"Savings","iban":"DK9430010000000099","currency":"DKK","customerId":"130d6b63-5137-49b2-9013-5b74dc4ea154"}'
post '{"name":"Holiday Fund","iban":"DK9430010000000100","currency":"DKK","customerId":"130d6b63-5137-49b2-9013-5b74dc4ea154"}'

# Paul Martin (be9e139e) — 4 accounts
post '{"name":"Salary Account","iban":"DK9460000000000101","currency":"DKK","customerId":"be9e139e-ae48-4eea-9bc2-10e512e567ab"}'
post '{"name":"Savings","iban":"DK9460000000000102","currency":"DKK","customerId":"be9e139e-ae48-4eea-9bc2-10e512e567ab"}'
post '{"name":"Investment Account","iban":"DK9460000000000103","currency":"EUR","customerId":"be9e139e-ae48-4eea-9bc2-10e512e567ab"}'
post '{"name":"Emergency Fund","iban":"DK9460000000000104","currency":"DKK","customerId":"be9e139e-ae48-4eea-9bc2-10e512e567ab"}'

echo "Seeding complete"
