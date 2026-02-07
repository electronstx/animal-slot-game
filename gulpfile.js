import { src, dest, watch, series } from 'gulp';
import sharp from 'sharp';
import { Transform } from 'node:stream';
import { rm, writeFile, readdir } from 'node:fs/promises';
import { relative, join, extname, parse } from 'node:path';

const paths = {
    input: 'src/assets/**/*.{png,jpg,jpeg}',
    inputRoot: 'src/assets',
    output: 'public/assets'
};

const webpTransform = () => new Transform({
    objectMode: true,
    async transform(file, encoding, callback) {
        if (file.isNull() || file.isDirectory()) return callback(null, file);

        if (file.isStream()) {
            console.warn(`⚠️ Файл ${file.relative} пришел как стрим, конвертирую...`);
            return callback(new Error('Стримы не поддерживаются, используй буфферы'));
        }

        try {
            const inputBuffer = Buffer.from(file.contents);

            const optimizedBuffer = await sharp(inputBuffer)
                .webp({ 
                    quality: 80, 
                    effort: 6,
                    smartSubsample: true 
                })
                .toBuffer();

            file.contents = optimizedBuffer;
            file.path = file.path.replace(extname(file.path), '.webp');

            callback(null, file);
        } catch (err) {
            console.error(`🔴 Ошибка на файле: ${file.relative} -> ${err.message}`);
            callback(null, null);
        }
    }
});

export function optimizeImages() {
    return src(paths.input, { 
        nodir: true,
        buffer: true,
        removeBOM: false
    })
    .pipe(webpTransform())
    .pipe(dest(paths.output));
}

async function generateManifest() {
    try {
        const rawFiles = await readdir(paths.output, { recursive: true });
        const files = rawFiles.map(f => f.replace(/\\/g, '/'));
        const bundlesMap = {};
        const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'manifest.json');
        const imagesToSkip = jsonFiles.map(f => f.replace('.json', '.webp'));

        console.log('📦 Найдено атласов:', jsonFiles);
        console.log('🚫 Игнорируем картинки:', imagesToSkip);

        files.forEach(file => {
            if (file === 'manifest.json' || imagesToSkip.includes(file)) return;

            if (!/\.(webp|json|png|jpg)$/i.test(file)) return;

            const pathParts = file.split('/');
            const bundleName = pathParts.length > 1 ? pathParts[0] : 'main';
            
            const info = parse(file);
            const asset = {
                alias: info.name,
                src: file
            };

            if (!bundlesMap[bundleName]) bundlesMap[bundleName] = [];
            bundlesMap[bundleName].push(asset);
        });

        const manifest = {
            bundles: Object.entries(bundlesMap).map(([name, assets]) => ({
                name,
                assets
            }))
        };

        await writeFile(join(paths.output, 'manifest.json'), JSON.stringify(manifest, null, 2));
        console.log('✅ Манифест успешно обновлен!');
    } catch (err) {
        console.error('🔴 Ошибка:', err);
    }
}

export function startWatch() {
    console.log('🚀 Gulp: Система синхронизации запущена...');

    const watcher = watch(paths.input);

    watcher.on('change', series(optimizeImages, generateManifest));
    watcher.on('add', series(optimizeImages, generateManifest));

    watcher.on('unlink', async (filePath) => {
        try {
            const relativePath = relative('src/assets', filePath);
            const webpPath = relativePath.replace(extname(relativePath), '.webp');
            const destPath = join(paths.output, webpPath);

            await rm(destPath);
            console.log(`🗑️ Удален: ${webpPath}`);
            
            await generateManifest();
        } catch (err) {
            if (err.code !== 'ENOENT') {
                console.error(`🔴 Ошибка удаления:`, err.message);
            }
        }
    });
}

export const build = series(optimizeImages, generateManifest);
export const dev = series(build, startWatch);
export default dev;