nicns --in build/icon.png --out build/icon.icns

png-to-ico build/icon.png > build/icon.ico

electron-zip-packager . \
  --overwrite \
  --platform=darwin \
  --arch=x64 \
  --out=dist \
  --icon=build/icon.icns \
  --osxSign.identity='Developer ID Application: GitHub'

mv dist/Ummoji-darwin-x64.zip dist/Ummoji-$npm_package_version-mac.zip

electron-zip-packager . \
  --overwrite \
  --platform=win32 \
  --arch=ia32 \
  --out=dist \
  --icon=build/icon.ico

mv dist/Ummoji-win32-ia32.zip dist/Ummoji-$npm_package_version-win.zip

electron-zip-packager . \
  --overwrite \
  --platform=linux \
  --arch=x64 \
  --out=dist

mv dist/Ummoji-linux-x64.zip dist/Ummoji-$npm_package_version-linux.zip
