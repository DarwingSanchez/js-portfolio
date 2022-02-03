/* Crear path 
Debemos crear esto y no se instala nada porque ya viene dentro de node*/
const path = require('path');
/* Después de configurar webpack y babel
instalamos html-webpack */
const HtmlWebpackPlugin = require('html-webpack-plugin');
/* Añadimos lo necesario para trabajar con el css-loader */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
/* Requerimos a CopyPlugin para copiar archivos desde src a dist  */
const CopyPlugin = require('copy-webpack-plugin');
/* Optimiza la comprensión de css */
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
/* Optimiza la comprensión de JS */
const TerserPlugin = require('terser-webpack-plugin');
/*  */
const Dotenv = require('dotenv-webpack')


/* Crear modulo para exportar
Se debe crear un objeto con la configuración deseada */

module.exports = { 
    /* Aquí van las configuraciones  */
    entry: './src/index.js', /* Punto de entrada o elemento inicial de la app ej: index.js */
    /* Punto de salida, debemos escoger el path que creamos de primero
    El output debe ser un objeto */
    output: {
        clean: true,
        /* Resolve nos permite saber donde se encuentra nuestro proyecto
        __dirname guarda entonces el nombre de la carpeta de nuestro proyecto*/
        path: path.resolve(__dirname, 'dist'),
        /* Debemos crear el nombre del resultante del JS que se va unificaar  */
        filename: '[name].[contenthash].js', /* Se puede encontrar como bundle */
        /* Moviendo imagenes a la carpeta dist que que corresponde */
        assetModuleFilename: 'assets/images/[hash][ext][query]'
    },
    /* Siguen las extenciones con las que vamos a trabajar en el proyecto */
    resolve: {
        /* Aquí establecemos las extensiones con las que trabajamos y las metemos
        en el arreglo extensions:[] por ejemplo .js o si estamos trabajando con esbelt o react */
        extensions: ['.js'],
        /* Creando Alias */
        alias: {
        /* Nombre alias                 Direccion donde esta */
            '@utils': path.resolve(__dirname, 'src/utils/'),
            '@templates': path.resolve(__dirname, 'src/templates/'),
            '@styles': path.resolve(__dirname, 'src/styles/'),
            '@images': path.resolve(__dirname, 'src/assets/images/'),
        },
    }, 
    module:{
        rules: [
            /* Debe tener algunos elementos particulares */
            {
                /* 1. Debemos utilizar un test que especifica el tipo de extensiones con
                las que vamos a trabajar */
                test: /\.m?js$/, /* Esto se llama expresiones regulares */
                /* Debemos excluir la carpeta module */
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                /* Añadimos una regla para reconocer css y styl(preprocesador)*/
                test: /\.css|.styl$/i,
                use: [MiniCssExtractPlugin.loader,
                'css-loader',
                'stylus-loader'
                ],
            },
            /* Lo utilizamos para convertir las imagenes en variables y poderlas
            utilizar mejor en el JS  */
            {
                test: /\.png/,
                /* Para aceptar varios tipos de imagenes: 
                test: /\.(png|jpg,|jpeg|gif)$/i */
                type: 'asset/resource'
            },
            /* Añadiendo loader para cargar fuentes, se debe agregar algo en
             module.exports, especifico en el output */
            {
                test: /\.(woff|woff2)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: "application/font-woff",
                        name: "[name].[contenthash].[ext]",
                        outputPath: "./assets/fonts/",
                        publicPath: "../assets/fonts/",
                        esModule: false, 
                    },
                }
            }
        ]
    },
    plugins: [
        /* Creando la instancia para manejar el plugin de HTMLWebpack */
        new HtmlWebpackPlugin({
            inject : true,
            template : './public/index.html',
            filename : './index.html',
        }),
        /* Recopila todo el css que esta en archivos separados */
        new MiniCssExtractPlugin({
            filename: 'assets/[name].[contenthash].css'
        }), 
        /* Plugin para copiar imagenes desde el src a dist */
        new CopyPlugin({
            patterns: [{
                from: path.resolve(__dirname, "src", "assets/images"),
                to: "assets/images",
            }],
        }),
        new Dotenv(),
    ], 
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin(),
        ]
    }
}

/*NOTA:  Cuanto tengamos esto: 

module.exports = {
    entry: './src/index.js', 
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'

    },
    resolve: {
        extensions: ['.js']
    }
}


utilizamos el siguiente codigo:  ❯ npx webpack --mode production --config webpack.config.js
Con esto prepara el resultado que tenemos utilizando las configuraciones */
/* Luego creamos un Script en el archivo package.json para arrancar el modo de produccion de webpack: "build": "webpack --mode production" 
Y lo ejecutamos en consola: npm run build*/

/* LOADERS: Luego podemos instalar loaders que nos permitan hacer diferentes funcionalidades: 
Por ejemplo, podemos trabajar con Babel.. 

BABEL: es un transpilador que permite transformar el código nuevo de ES6+ a código
viejo el cual sea entendible por los navegadores.
Para instalar babel: 
comando: npm install babel-loader @babel/core 
Plugins de babel:
@babel/preset-env : JS moderno 
@babel/plugin-transform-runtime: Nos ayuda a trabajar con asincronismo

Código completo: npm install babel-loader @babel/core @babel/preset-env @babel/plugin-transform-runtime -D


Luego de generar por ejemplo babel toca configurarlo, debemos crear un archivo:
.babelrc*/

