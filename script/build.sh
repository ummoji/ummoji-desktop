# clean up
mkdir -p dist
rm -rf dist
mkdir dist

# create icons
nicns --in build/icon.png --out build/icon.icns
png-to-ico build/icon.png > build/icon.ico

# mac
electron-packager . --platform=darwin --arch=x64 --out=dist --icon=build/icon.icns --osxSign.identity='Developer ID Application: GitHub'
codesign --deep --force --verbose --sign - dist/Ummoji-darwin-x64/Ummoji.app
create-dmg dist/Ummoji-darwin-x64/Ummoji.app
mv Ummoji-$npm_package_version.dmg dist/ummoji.dmg

# win
electron-packager . --platform=win32 --arch=ia32 --out=dist --icon=build/icon.ico
cd dist/Ummoji-win32-ia32
zip -r -X --quiet "../ummoji-win.zip" *
cd ../../

# linux
electron-packager . --platform=linux --arch=x64 --out=dist
cd dist/Ummoji-linux-x64
zip -r -X --quiet "../ummoji-linux.zip" *
cd ../../
