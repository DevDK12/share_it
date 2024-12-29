module.exports = {
  root: true,
  extends: '@react-native',



  //* This Overrites rules defined in '@react-native''s eslint config

  //_ This is cached , 
  //*   so make sure to reload vscode after changing this file

  rules: {
    'comma-dangle': 'off', //* 'necessary trailing comma' warning
    'quotes': 'off', //* 'necessary double quotes' warning
    'react/react-in-jsx-scope': 'off',
    'eol-last': 'off', //* 'missing newline at end of file' warning
    'no-trailing-spaces': 'off', //* 'trailing spaces not allowed' warning
    'unused-vars': 'warning', //* 'variable is defined but never used' warning
    // 'semi': 'off', //* 'missing semicolon' warning
  }
};
