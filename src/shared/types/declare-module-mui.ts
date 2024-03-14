import '@mui/material/styles';
import '@mui/material/Typography';

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    headline1: true;
    headline2: true;
    headline3: true;
    headline4: true;
    headline5: true;
    headline6: true;
    body1: true;
    body1Medium: true;
    body1Num: true;
    body1NumMedium: true;
    body2: true;
    body2Medium: true;
    body2Num: true;
    body2NumMedium: true;
    link1: true;
    link1Medium: true;
    link2: true;
    link2Medium: true;
    subhead1: true;
    subhead2: true;
    overline: true;
    caption: true;
  }
}
declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      bg: {
        button: {
          white: {
            default: string;
          };
        };
      };
      text: {
        text: {
          white: string;
        };
      };
      skeleton: {
        start: string;
        end: string;
      };
      checkbox: {
        icon: {
          ic: {
            sm: string;
          };
        };
      };
      icon: {
        button: {
          padding: {
            p: {
              md: string;
            };
          };
        };
        icon: {
          md: string;
          sm: string;
        };
      };
      border: {
        default: string;
        radius: {
          md: string;
        };
        hover: string;
      };
      common: {
        white: string;
      };
      plus: {
        main: string;
      };
      light: {
        blue: {
          NINE_HUNDRED: string;
        };
      };
      components: {
        switch: {
          slide: {
            fill: string;
          };
          knob: {
            fill: {
              enabled: string;
            };
          };
        };
      };
      page: {
        header: {
          button: {
            padding: {
              py: string;
              px: string;
            };
          };
        };
      };
      divider: {
        divider: string;
        default: string;
      };
      layout: {
        column: {
          container: string;
        };
        padding: {
          lg: string;
        };
        body: {
          padding: {
            px: string;
          };
        };
      };
      table: {
        padding: {
          py: {
            md: string;
          };
          px: string;
        };
      };
      button: {
        padding: {
          py: {
            lg: string;
          };
          px: {
            lg: string;
            sm: string;
          };
        };
        gap: string;
      };
      menu: {
        item: {
          padding: {
            py: string;
            px: string;
          };
        };
        border: {
          radius: string;
        };
        surface: string;
        padding: {
          gap: string;
          menu: {
            py: string;
          };
        };
        text: string;
      };
      font: {
        family: {
          roboto: string;
          roboto_mono: string;
        };
        weight: {
          thin: string;
          extra_light: string;
          light: string;
          regular: string;
          medium: string;
          semi_bold: string;
          bold: string;
          extra_bold: string;
          black: string;
        };
      };
      blue: {
        grey: {
          one_hundred: string;
        };
      };
      input: {
        padding: {
          pad: {
            y: {
              sm: string;
              md: string;
            };
            x: string;
          };
        };
        input: {
          bg: string;
        };
        border: {
          hover: string;
          focused: string;
          default: string;
        };
        shape: {
          border: {
            radius: string;
            default: string;
          };
        };
      };
      shape: {
        border: {
          radius: {
            md: string;
          };
        };
      };
      base: {
        primary: {
          contrast: string;
        };
        plus: {
          main: string;
        };
        info: {
          main: string;
        };
        success: {
          main: string;
        };
        warning: {
          main: string;
        };
        error: {
          main: string;
        };
        yellow: {
          main: string;
        };
        lime: {
          main: string;
        };
        secondary: {
          main: string;
        };
        module: {
          zero_five: string;
          first: string;
          second: string;
          third: string;
          fourth: string;
          fifth: string;
          fifteenth: string;
        };
      };
      tabs: {
        padding: {
          py: string;
          px: string;
        };
      };
    };
  }

  interface ThemeOptions {
    custom: {
      bg: {
        button: {
          white: {
            default: string;
          };
        };
      };
      text: {
        text: {
          white: string;
        };
      };
      skeleton: {
        start: string;
        end: string;
      };
      checkbox: {
        icon: {
          ic: {
            sm: string;
          };
        };
      };
      icon: {
        button: {
          padding: {
            p: {
              md: string;
            };
          };
        };
        icon: {
          md: string;
          sm: string;
        };
      };
      border: {
        default: string;
        radius: {
          md: string;
        };
        hover: string;
      };
      common: {
        white: string;
      };
      plus: {
        main: string;
      };
      light: {
        blue: {
          NINE_HUNDRED: string;
        };
      };
      components: {
        switch: {
          slide: {
            fill: string;
          };
          knob: {
            fill: {
              enabled: string;
            };
          };
        };
      };
      page: {
        header: {
          button: {
            padding: {
              py: string;
              px: string;
            };
          };
        };
      };
      divider: {
        divider: string;
        default: string;
      };
      layout: {
        column: {
          container: string;
        };
        padding: {
          lg: string;
        };
        body: {
          padding: {
            px: string;
          };
        };
      };
      table: {
        padding: {
          py: {
            md: string;
          };
          px: string;
        };
      };
      button: {
        padding: {
          py: {
            lg: string;
          };
          px: {
            lg: string;
            sm: string;
          };
        };
        gap: string;
      };
      menu: {
        item: {
          padding: {
            py: string;
            px: string;
          };
        };
        border: {
          radius: string;
        };
        surface: string;
        padding: {
          gap: string;
          menu: {
            py: string;
          };
        };
        text: string;
      };
      font: {
        family: {
          roboto: string;
          roboto_mono: string;
        };
        weight: {
          thin: string;
          extra_light: string;
          light: string;
          regular: string;
          medium: string;
          semi_bold: string;
          bold: string;
          extra_bold: string;
          black: string;
        };
      };
      blue: {
        grey: {
          one_hundred: string;
        };
      };
      input: {
        padding: {
          pad: {
            y: {
              sm: string;
              md: string;
            };
            x: string;
          };
        };
        input: {
          bg: string;
        };
        border: {
          hover: string;
          focused: string;
          default: string;
        };
        shape: {
          border: {
            radius: string;
            default: string;
          };
        };
      };
      shape: {
        border: {
          radius: {
            md: string;
          };
        };
      };
      base: {
        primary: {
          contrast: string;
        };
        plus: {
          main: string;
        };
        info: {
          main: string;
        };
        success: {
          main: string;
        };
        warning: {
          main: string;
        };
        error: {
          main: string;
        };
        yellow: {
          main: string;
        };
        lime: {
          main: string;
        };
        secondary: {
          main: string;
        };
        module: {
          zero_five: string;
          first: string;
          second: string;
          third: string;
          fourth: string;
          fifth: string;
          fifteenth: string;
        };
      };
      tabs: {
        padding: {
          py: string;
          px: string;
        };
      };
    };
  }

  interface TypographyVariants {
    headline1: React.CSSProperties;
    headline2: React.CSSProperties;
    headline3: React.CSSProperties;
    headline4: React.CSSProperties;
    headline5: React.CSSProperties;
    headline6: React.CSSProperties;
    body1: React.CSSProperties;
    body1Medium: React.CSSProperties;
    body1Num: React.CSSProperties;
    body2: React.CSSProperties;
    body2Medium: React.CSSProperties;
    body2Num: React.CSSProperties;
    body2NumMedium: React.CSSProperties;
    body1NumMedium: React.CSSProperties;
    link1: React.CSSProperties;
    link1Medium: React.CSSProperties;
    link2: React.CSSProperties;
    link2Medium: React.CSSProperties;
    subhead1: React.CSSProperties;
    subhead2: React.CSSProperties;
    overline: React.CSSProperties;
    caption: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    headline1: React.CSSProperties;
    headline2: React.CSSProperties;
    headline3: React.CSSProperties;
    headline4: React.CSSProperties;
    headline5: React.CSSProperties;
    headline6: React.CSSProperties;
    body1: React.CSSProperties;
    body1Medium: React.CSSProperties;
    body1Num: React.CSSProperties;
    body2: React.CSSProperties;
    body2Medium: React.CSSProperties;
    body2NumMedium: React.CSSProperties;
    body1NumMedium: React.CSSProperties;
    body2Num: React.CSSProperties;
    link1: React.CSSProperties;
    link1Medium: React.CSSProperties;
    link2: React.CSSProperties;
    link2Medium: React.CSSProperties;
    subhead1: React.CSSProperties;
    subhead2: React.CSSProperties;
    overline: React.CSSProperties;
    caption: React.CSSProperties;
  }
}
