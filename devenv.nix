{ pkgs, lib, config, inputs, ... }:

{
  packages = [ pkgs.git ];

  languages.javascript = {
    enable = true;
    pnpm = {
      enable = true;
      install.enable = true;
    };
  };

  enterShell = ''
    pnpm --version
  '';

  enterTest = ''
    pnpm run test:unit
  '';
}
