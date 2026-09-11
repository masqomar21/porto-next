#!/usr/bin/env bash

FILE="d6993ad34309.tar.zst.age"
EXPECTED_HASH="40c686202840b8af0325fcac54e2eb43f4f5a736bd9818cbbea78ce1226a5d7f"

if [ ! -f "$FILE" ]; then
    echo "Error: File $FILE not found."
    exit 1
fi

ls -lh "$FILE"
echo ""
shasum -a 256 "$FILE"
echo ""

SIZE=$(stat -f%z "$FILE" 2>/dev/null || stat -c%s "$FILE" 2>/dev/null)
SIZE_MB=$(awk -v size="$SIZE" 'BEGIN { printf "%.2f", size / 1048576 }')
CALC_HASH=$(shasum -a 256 "$FILE" | awk '{print $1}')

echo "=== VERIFIKASI INTEGRITAS ARSIP IBRAHIM ARIEF ==="
echo ""
printf "[+] %-15s: %s\n" "Nama File" "$FILE"
printf "[+] %-15s: %s bytes (~%s MB)\n" "Ukuran Asli" "$SIZE" "$SIZE_MB"
printf "[+] %-15s: %s\n" "Hash Diharapkan" "$EXPECTED_HASH"
printf "[+] %-15s: %s\n" "Hash Terhitung" "$CALC_HASH"
echo "--------------------------------------------------------------------------------"

if [ "$CALC_HASH" = "$EXPECTED_HASH" ]; then
    echo -e "[\033[32m✓\033[0m] STATUS         : \033[32mVERIFIKASI BERHASIL (HASH COCOK 100%)\033[0m"
else
    echo -e "[\033[31m✗\033[0m] STATUS         : \033[31mVERIFIKASI GAGAL (HASH TIDAK COCOK)\033[0m"
fi

echo "[🔒] ENKRIPSI      : age-encryption (scrypt, ChaCha20-Poly1305)"
echo "[⏳] STATUS KUNCI  : Menunggu rilis kunci dekripsi publik"
