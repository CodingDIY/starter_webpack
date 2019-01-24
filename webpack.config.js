const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// File Path
const sourceFolder = 'src',
	buildFolder = 'assets',
	PATHS = {
		build: path.resolve(__dirname, buildFolder),
		src: path.resolve(__dirname, sourceFolder),
		node: path.resolve(__dirname, 'node_modules'),
		appJS: path.resolve(__dirname, `${sourceFolder}/js/app.js`)
	};

// Development Server Options
const devServerOptions = {
    contentBase: __dirname + '/',
    port: 4000
};

// Plugins
const CopyImage = [
	{ from: PATHS.src + '/images', to: PATHS.build + '/images' }
];

const CopyFont = [
	{ from: PATHS.src + '/webfonts/', to: PATHS.build + '/webfonts/' }
];

const fileOptions = {
	'css': ['app.bundle.css'],
	'js': ['app.bundle.js'],
	'chunks': {
		'head': {
			'entry': '',
			'css': 'app.bundle.css'
		},
		'body': {
			'entry': 'app.bundle.js',
			'css': ''
		}
	}
};

const IndexHtml = {
    filename: 'index.html',
    template: `${PATHS.src}/index.html`,
    'files': fileOptions
};

const pluginList = [
    new ExtractTextPlugin('css/app.bundle.css'),
    new CopyWebpackPlugin(CopyImage),
    new CopyWebpackPlugin(CopyFont),
    new HtmlWebpackPlugin(IndexHtml)
];

// Modudules
const js = {
    loader: 'babel-loader',
    test: /\.js$/,
    exclude: /node_modules/
};

const styles = {
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader?url=false', 'postcss-loader']
    })
};

const sass = {
    test: /\.scss$/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader?url=false', 'sass-loader']
    })
};

const images = {
    test: /\.(gif|png|jpe?g|svg)$/i,
    use: [
        'file-loader?name=assets/images/[name].[ext]',
        {
            loader: 'image-webpack-loader',
            options: {
                mozjpeg: {
                    progressive: true,
                    quality: 65
                },
                optipng: {
                    enabled: false,
                },
                pngquant: {
                    quality: '65-90',
                    speed: 4
                },
                gifsicle: {
                    interlaced: false,
                }
            }
        }
    ]
};

const fa = {
	test: /font-awesome\.config\.js/,
	use: [
		{ loader: 'style-loader' },
		{ loader: 'font-awesome-loader' }
	]
};

const webfonts = {
	test: /\.(woff|woff2|eot|ttf|svg)$/,
	loader: 'url-loader?limit=50000&name=assets/webfonts/[name].[ext]'
};

module.exports = {
    entry: PATHS.appJS,
    output: {
        path: PATHS.build,
        filename: 'js/app.bundle.js'
    },
	mode: 'development',
	devServer: devServerOptions,
	module: {
        rules: [js, styles, sass, images, fa, webfonts]
    },
	plugins: pluginList
}



