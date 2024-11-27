{
  pkgs,
  lib,
  config,
  inputs,
  ...
}:
let
  pkgs-unstable = import inputs.nixpkgs-unstable { system = pkgs.stdenv.system; };
in
{
  packages = with pkgs-unstable; [
    git
  ];

  languages.javascript = {
    enable = true;
    pnpm = {
      enable = true;
      package = pkgs-unstable.pnpm;
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
