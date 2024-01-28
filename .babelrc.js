const plugins = [
    [
        'babel-plugin-import',
        {
            libraryName: '@mui/material',
            libraryDirectory: '',
            camel2DashComponentName: false,
        },
        'core',
    ],
    [
        'babel-plugin-import',
        {
            libraryName: '@mui/icons-material',
            libraryDirectory: '',
            camel2DashComponentName: false,
        },
        'icons',
    ],
    [
        'babel-plugin-import',
        {
            libraryName: '@mui/x-date-pickers',
            libraryDirectory: '',
            camel2DashComponentName: false,
        },
        'x-date-pickers',
    ],
];

module.exports = { plugins };
