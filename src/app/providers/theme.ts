import { createTheme } from '@mui/material/styles';
import { ruRU } from '@mui/material/locale';
import * as variablesModule from '../variables.module.scss';

const { default: Variables } = variablesModule;

export const theme = createTheme(
  {
    custom: {
      bg: {
        button: {
          white: {
            default: Variables.BG_BUTTON_WHITE_DEFAULT,
          },
        },
      },
      text: {
        text: {
          white: Variables.TEXT_TEXT_WHITE,
        },
      },
      skeleton: {
        start: Variables.SKELETON_START,
        end: Variables.SKELETON_END,
      },
      checkbox: {
        icon: {
          ic: {
            sm: Variables.CHECKBOX_ICON_IC_SM,
          },
        },
      },
      icon: {
        button: {
          padding: {
            p: {
              md: Variables.ICON_BUTTON_PADDING_P_MD,
            },
          },
        },
        icon: {
          md: Variables.ICON_ICON_MD,
          sm: Variables.ICON_ICON_SM,
        },
      },
      border: {
        default: Variables.BORDER_DEFAULT,
        radius: { md: Variables.BORDER_RADIUS_MD },
        hover: Variables.BORDER_HOVER,
      },
      common: {
        white: Variables.COMMON_WHITE,
      },
      plus: {
        main: Variables.PLUS_MAIN,
      },
      light: {
        blue: {
          NINE_HUNDRED: Variables.LIGHT_BLUE_900,
        },
      },
      components: {
        switch: {
          slide: {
            fill: Variables.COMPONENTS_SWITCH_SLIDE_FILL,
          },
          knob: {
            fill: {
              enabled: Variables.COMPONENTS_SWITCH_KNOB_FILL_ENABLED,
            },
          },
        },
      },
      page: {
        header: {
          button: {
            padding: {
              py: Variables.PAGE_HEADER_BUTTON_PADDING_PY,
              px: Variables.PAGE_HEADER_BUTTON_PADDING_PX,
            },
          },
        },
      },
      divider: {
        divider: Variables.DIVIDER_DIVIDER,
        default: Variables.DIVIDER_DEFAULT,
      },
      layout: {
        column: {
          container: Variables.LAYOUT_COLUMN_CONTAINER,
        },
        padding: {
          lg: Variables.LAYOUT_PADDING_LG,
        },
        body: {
          padding: {
            px: Variables.LAYOUT_BODY_PADDING_PX,
          },
        },
      },
      table: {
        padding: {
          py: {
            md: Variables.TABLE_PADDING_PY_MD,
          },
          px: Variables.TABLE_PADDING_PX,
        },
      },
      tabs: {
        padding: {
          py: Variables.TABS_PADDING_PY,
          px: Variables.TABS_PADDING_PX,
        },
      },
      button: {
        padding: {
          py: {
            lg: Variables.BUTTON_PADDING_PY_LG,
          },
          px: {
            lg: Variables.BUTTON_PADDING_PX_LG,
            sm: Variables.BUTTON_PADDING_PX_SM,
          },
        },
        gap: Variables.BUTTON_GAP,
      },
      menu: {
        item: {
          padding: {
            py: Variables.MENU_ITEM_PADDING_PY,
            px: Variables.MENU_ITEM_PADDING_PX,
          },
        },
        padding: {
          gap: Variables.MENU_PADDING_GAP,
          menu: {
            py: Variables.MENU_PADDING_MENU_PY,
          },
        },
        surface: Variables.MENU_SURFACE,
        border: {
          radius: Variables.MENU_BORDER_RADIUS,
        },
        text: Variables.MENU_TEXT,
      },
      font: {
        family: {
          roboto: Variables.FONT_FAMILY_ROBOTO,
          roboto_mono: Variables.FONT_FAMILY_ROBOTO_MONO,
        },
        weight: {
          thin: Variables.FONT_WEIGHT_THIN,
          extra_light: Variables.FONT_WEIGHT_EXTRA_LIGHT,
          light: Variables.FONT_WEIGHT_LIGHT,
          regular: Variables.FONT_WEIGHT_REGULAR,
          medium: Variables.FONT_WEIGHT_MEDIUM,
          semi_bold: Variables.FONT_WEIGHT_SEMI_BOLD,
          bold: Variables.FONT_WEIGHT_BOLD,
          extra_bold: Variables.FONT_WEIGHT_EXTRA_BOLD,
          black: Variables.FONT_WEIGHT_BLACK,
        },
      },
      blue: {
        grey: {
          one_hundred: Variables.BLUE_GREY_100,
        },
      },
      input: {
        padding: {
          pad: {
            y: {
              sm: Variables.INPUT_PADDING_PAD_Y_SM,
              md: Variables.INPUT_PADDING_PAD_Y_MD,
            },
            x: Variables.INPUT_PADDING_PAD_X,
          },
        },
        input: {
          bg: Variables.INPUT_INPUT_BG,
        },
        border: {
          hover: Variables.INPUT_BORDER_HOVER,
          focused: Variables.INPUT_BORDER_FOCUSED,
          default: Variables.INPUT_BORDER_DEFAULT,
        },
        shape: {
          border: {
            radius: Variables.INPUT_SHAPE_BORDER_RADIUS,
            default: Variables.INPUT_BORDER_DEFAULT,
          },
        },
      },
      shape: {
        border: {
          radius: {
            md: Variables.SHAPE_BORDER_RADIUS_MD,
          },
        },
      },
      base: {
        primary: {
          contrast: Variables.BASE_PRIMARY_CONTRAST,
        },
        plus: {
          main: Variables.BASE_PLUS_MAIN,
        },
        info: {
          main: Variables.BASE_INFO_MAIN,
        },
        success: {
          main: Variables.BASE_SUCCESS_MAIN,
        },
        warning: {
          main: Variables.BASE_WARNING_MAIN,
        },
        error: {
          main: Variables.BASE_ERROR_MAIN,
        },
        yellow: {
          main: Variables.BASE_YELLOW_MAIN,
        },
        lime: {
          main: Variables.BASE_LIME_MAIN,
        },
        secondary: {
          main: Variables.BASE_SECONDARY_MAIN,
        },
        module: {
          zero_five: Variables.BASE_MODULE_05,
          first: Variables.BASE_MODULE_1,
          second: Variables.BASE_MODULE_2,
          third: Variables.BASE_MODULE_3,
          fourth: Variables.BASE_MODULE_4,
          fifth: Variables.BASE_MODULE_5,
          fifteenth: Variables.BASE_MODULE_15,
        },
      },
    },
    palette: {
      primary: { main: Variables.PRIMARY_MAIN, dark: '#000' },
      text: {
        primary: 'rgba(26, 26, 26, 0.87)',
        secondary: Variables.TEXT_SECONDARY,
        disabled: Variables.TEXT_DISABLED,
      },
      common: {
        white: '#FFF',
      },
      secondary: {
        main: 'rgba(19, 29, 53, 0.08)',
      },
      warning: {
        main: Variables.WARNING_MAIN,
      },
      error: {
        main: Variables.ERROR_MAIN,
      },
      info: {
        main: Variables.INFO_MAIN,
      },
      success: {
        main: Variables.SUCCESS_MAIN,
      },
      action: {
        active: Variables.ACTION_ACTIVE,
        hover: Variables.ACTION_HOVER,
        focus: Variables.ACTION_FOCUS,
        selected: Variables.ACTION_SELECTED,
      },
    },
    components: {
      MuiTypography: {
        defaultProps: {
          variantMapping: {
            h1: 'h1',
            h2: 'h2',
            h3: 'h3',
            h4: 'h4',
            h5: 'h5',
            h6: 'h6',
            subtitle1: 'h6',
            subtitle2: 'h6',
            body1: 'p',
            body1Medium: 'p',
            body1Num: 'p',
            body1NumMedium: 'p',
            body2: 'p',
            body2Medium: 'p',
            body2Num: 'p',
            body2NumMedium: 'p',
            headline1: 'h1',
            headline2: 'h2',
            headline3: 'h3',
            headline4: 'h4',
            headline5: 'h5',
            headline6: 'h6',
            link1: 'p',
            link1Medium: 'p',
            link2: 'p',
            link2Medium: 'p',
            subhead1: 'p',
            subhead2: 'p',
            overline: 'p',
            caption: 'p',
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            // Controls default (unchecked) color for the thumb
            color: '#FAFAFA',
          },
          colorPrimary: {
            '&.Mui-checked': {
              // Controls checked color for the thumb
              color: '#2196F3',
            },
          },
          track: {
            backgroundColor: Variables.COMPONENTS_SWITCH_SLIDE_FILL,
            '.Mui-checked.Mui-checked + &': {
              // Controls checked color for the track
              opacity: 0.5,
              backgroundColor: '#2196F3',
            },
          },
        },
      },
    },
    typography: {
      headline1: {
        fontFamily: Variables.FONT_FAMILY_ROBOTO,
        fontSize: '96px',
        fontStyle: 'normal',
        fontWeight: 300,
        lineHeight: '116%',
        letterSpacing: '-0.01px',
      },
      headline2: {
        fontFamily: Variables.FONT_FAMILY_ROBOTO,
        fontSize: '60px',
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: '120%',
      },
      headline3: {
        fontFamily: Variables.FONT_FAMILY_ROBOTO,
        fontSize: '48px',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '116%',
      },
      headline4: {
        fontFamily: Variables.FONT_FAMILY_ROBOTO,
        fontSize: '34px',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '123%',
      },
      headline5: {
        fontFamily: Variables.FONT_FAMILY_ROBOTO,
        fontSize: '24px',
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: '133%',
      },
      headline6: {
        fontFamily: Variables.FONT_FAMILY_ROBOTO,
        fontSize: '20px',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: '160%',
      },
      body1: {
        fontFamily: Variables.FONT_FAMILY_ROBOTO,
        fontSize: '16px',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '150%',
        letterSpacing: '0.024px',
      },
      body1Medium: {
        fontFamily: Variables.FONT_FAMILY_ROBOTO,
        fontSize: '16px',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: '150%',
        letterSpacing: '0.024px',
      },
      body1Num: {
        fontFamily: Variables.FONT_FAMILY_ROBOTO_MONO,
        fontSize: '16px',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '150%',
        letterSpacing: '0.024px',
      },
      body1NumMedium: {
        fontFamily: Variables.FONT_FAMILY_ROBOTO_MONO,
        fontSize: '16px',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: '150%',
        letterSpacing: '0.024px',
      },
      body2: {
        fontFamily: Variables.FONT_FAMILY_ROBOTO,
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '143%',
        letterSpacing: '0.024px',
      },
      body2Medium: {
        fontFamily: Variables.FONT_FAMILY_ROBOTO,
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: '143%',
        letterSpacing: '0.024px',
      },
      body2Num: {
        fontFamily: Variables.FONT_FAMILY_ROBOTO_MONO,
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '143%',
        letterSpacing: '0.024px',
      },
      body2NumMedium: {
        fontFamily: Variables.FONT_FAMILY_ROBOTO_MONO,
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: '143%',
        letterSpacing: '0.024px',
      },
      link1: {
        color: Variables.LINK_DEFAULT,
        fontFamily: Variables.FONT_FAMILY_ROBOTO,
        fontSize: '16px',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '150%',
        letterSpacing: '0.024px',
        textDecoration: 'underline',
      },
      link1Medium: {
        color: Variables.LINK_DEFAULT,
        fontFamily: Variables.FONT_FAMILY_ROBOTO,
        fontSize: '16px',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: '150%',
        letterSpacing: '0.024px',
        textDecoration: 'underline',
      },
      link2: {
        color: Variables.LINK_DEFAULT,
        fontFamily: Variables.FONT_FAMILY_ROBOTO,
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '143%',
        letterSpacing: '0.024px',
        textDecoration: 'underline',
      },
      link2Medium: {
        color: Variables.LINK_DEFAULT,
        fontFamily: Variables.FONT_FAMILY_ROBOTO,
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: '143%',
        letterSpacing: '0.024px',
        textDecoration: 'underline',
      },
      subhead1: {
        color: Variables.TEXT_PRIMARY,
        fontFamily: Variables.FONT_FAMILY_ROBOTO,
        fontSize: '16px',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '175%',
        letterSpacing: '0.024px',
      },
      subhead2: {
        color: Variables.TEXT_PRIMARY,
        fontFamily: Variables.FONT_FAMILY_ROBOTO,
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: '157%',
        letterSpacing: '0.024px',
      },
      overline: {
        color: Variables.TEXT_PRIMARY,
        fontFamily: Variables.FONT_FAMILY_ROBOTO,
        fontSize: '12px',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '266%',
        letterSpacing: '0.83px',
        textTransform: 'uppercase',
      },
      caption: {
        color: Variables.TEXT_PRIMARY,
        fontFamily: Variables.FONT_FAMILY_ROBOTO,
        fontSize: '12px',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '166%',
        letterSpacing: '0.3px',
      },
    },
  },
  ruRU,
);
