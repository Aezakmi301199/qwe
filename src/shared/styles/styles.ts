import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  Stack,
  Tab,
  TableContainer,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { theme } from '../../app/providers/theme';

interface HeaderButtonsOwnerProps {
  selected?: boolean;
}

export const HeaderButton = styled(Button)((props: HeaderButtonsOwnerProps) => ({
  cursor: 'pointer',
  fontSize: '14px',
  textTransform: 'none',
  fontWeight: '500',
  color: 'rgba(255, 255, 255, 0.60)',
  borderRadius: '45px',
  letterSpacing: '0.056px',
  fontFamily: 'Roboto',
  fontStyle: 'normal',

  padding: `${theme.custom.page.header.button.padding.py} ${theme.custom.page.header.button.padding.px}`,
  ...(props.selected && {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: '4px 12px',
    borderRadius: '45px',
    height: '32px',
    color: 'white',
  }),
  '&:hover': {
    ...(props.selected && {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    }),
  },
}));

export const DatePickerContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
});

export const DatePickerFrom = styled(DatePicker)({
  '& .MuiInputBase-input': {
    '&::placeholder': {
      opacity: 0,
    },
  },
  '& .MuiInputBase-root': {
    height: '40px',
    borderRadius: '8px',
    '& fieldset': { borderRight: 'none' },
    borderTopRightRadius: '0px',
    borderTopLeftRadius: '8px',
    borderRight: 'none',
    borderBottomRightRadius: '0px',
    borderBottomLeftRadius: '8px',
  },
});

export const DatePickerAfter = styled(DatePicker)({
  '& .MuiInputBase-input': {
    '&::placeholder': {
      opacity: 0,
    },
  },
  '& .MuiInputBase-root': {
    height: '40px',
    borderRadius: '8px',
    borderTopRightRadius: '8px',
    borderTopLeftRadius: '0px',
    borderRight: 'none',
    borderBottomRightRadius: '8px',
    borderBottomLeftRadius: '0px',
  },
});

export const DatePickersContainer = styled(FormControl)({
  width: '100%',
});

export const DataGridContainer = styled(Box)({
  display: 'flex',
  overflowY: 'auto',
  flexDirection: 'column',
  paddingLeft: '24px',
});

export const InputFiltersContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  justifyContent: 'center',
});

export const InputGridContainer = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: '20px',
});

export const InputGridContainerTwoColumn = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr 2fr',
  gap: '40px',
});

export const GridMapContainer = styled(Stack)(() => ({
  height: '100vh',
  position: 'relative',
  // padding: `${theme.custom.layout.padding.lg} 0px ${theme.custom.layout.padding.lg}`,
}));

export const GridCardContainer = styled(Stack)({
  display: 'flex',
});

export const CardContainerBox = styled(Stack)({
  height: 'calc(100dvh - 290px)',
  overflowY: 'auto',
  overflowX: 'hidden',
  display: 'grid',
  backgroundColor: 'white',
  gap: '16px',
  marginTop: '16px',
});

export const MapContainer = styled(Stack)({
  width: '100%',
  height: '100%',
  backgroundColor: 'none',
  zIndex: 1,
});

export const InputBaseLineContainer = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '20px',
  justifyContent: 'center',
  marginTop: '8px',
});

export const ModalButtonContainer = styled(Box)({
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
  justifyContent: 'flex-end',
});

export const PopoverContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '270px',
  padding: '8px 0',
});

export const PopoverAccountContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '305px',
  padding: '8px 0',
});

export const PopoverItemContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  padding: '12px 16px',
  gap: '16px',
});

export const ColumnContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

export const WFullContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
});

export const ToolbarContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '16px',
  padding: '0px 24px 0px 0px',
});

export const ItemsCenterContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

export const SelectContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '9px',
  borderRadius: '8px',
});

export const SelectItemsContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '0px',
  borderRadius: '8px',
});

export const CommentBodyBox = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
});

export const CommentBoxContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  maxHeight: 'calc(100vh - 240px)',
  overflowY: 'auto',
  padding: '24px',
  borderTop: '1px solid rgba(19, 29, 53, 0.12)',
});

export const CloseMapDrawerButton = styled('img')({
  zIndex: 1,
  padding: '3px',
  position: 'absolute',
  top: '25px',
  left: '-30px',
});

export const MapTableButton = styled(Button)({
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  width: '188px',
  gap: '8px',
  textTransform: 'none',
  textDecoration: 'none',
  padding: '6px 16px',
  borderColor: '#D1D1D1',
});

export const CardTableButton = styled(Button)({
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
  width: '180px',
  textTransform: 'none',
  textDecoration: 'none',
  padding: '6px 16px',
  borderColor: '#D1D1D1',
});

export const LoginButton = styled(Button)({
  width: '330px',
  borderRadius: '8px',
  boxShadow: 'none',
  textTransform: 'none',
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '15px',
  letterSpacing: '0.42px',
  '&:hover': {
    background: '#2b63be',
    boxShadow: 'none',
  },
});

export const LoginContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '44px',
  gap: '12px',
});

export const ButtonContainer = styled(Box)({
  marginTop: '24px',
  display: 'flex',
  gap: '12px',
  flexDirection: 'column',
  alignItems: 'center',
});

export const IconBox = styled(Stack)({
  display: 'flex',
  flexDirection: 'row',
  gap: '16px',
  alignItems: 'center',
});

export const ResetButton = styled(Button)({
  backgroundColor: '#F1F5F9',
  boxShadow: 'none',
  color: theme.palette.text.primary,
  fontFamily: 'Roboto',
  fontSize: '15px',
  textTransform: 'none',
  borderRadius: '8px',
  '&:hover': {
    background: '#E1E7EF',
    boxShadow: 'none',
  },
});

export const Header = styled(Box)({
  top: '0',
  left: '0',
  right: '0',
  background: '#1A1A1A',
  height: '56px',
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0px 24px',
  gap: '16px',
  zIndex: 1,
});

export const ButtonContainerHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
});

export const ButtonsContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  height: '40px',
  borderRadius: '8px',
});

export const TabControl = styled(Box)({
  borderColor: 'divider',
  paddingTop: '16px',
});

export const GroupButton = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#F8FAFC',
  padding: '13px 24px',
  flexDirection: 'row',
  overflowX: 'auto',
  gap: '16px',
});

export const Text = styled(Typography)({
  fontSize: '14px',
  color: '#000000DE',
  textTransform: 'none',
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
});

export const GroupButtonContainer = styled(ToggleButtonGroup)({
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.common.white,
  borderTopLeftRadius: '8px',
  borderBottomLeftRadius: '8px',
});

export const CommentBox = styled(Box)({
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '8px',
  marginRight: '16px',
});

export const CardStatusCommentBox = styled(Stack)({
  marginTop: '4px',
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const CardButtonContainer = styled(Stack)({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  gap: '8px',
});

export const FooterButtonContainer = styled(Stack)({
  flexDirection: 'row',
  marginTop: '11px',
  alignItems: 'center',
  width: '100%',
});

export const CallCardButton = styled(Button)({
  padding: '4px 10px',
  width: '100%',
  borderRadius: '8px',
  boxShadow: 'none',
  textTransform: 'none',
  '&:hover': {
    background: '#2b63be',
    boxShadow: 'none',
  },
});

export const StyledTab = styled(Tab)({
  color: '#1A1A1A',
  opacity: '1',
  padding: '9px 16px',
  textDecoration: 'none',
  textTransform: 'none',
  maxWidth: 'fit-content',
  minWidth: 'auto',
  letterSpacing: '0.056px',
  '&.Mui-selected': {
    color: theme.palette.text.primary,
  },
});

export const ToggleButtonComponent = styled(ToggleButton)({
  display: 'flex',
  gap: '8px',
  borderRadius: '8px',
});

export const ChatContainer = styled(TextField)({
  display: 'flex',
  flexDirection: 'column',
  width: '450px',
  borderTop: '1px solid rgba(19, 29, 53, 0.12)',
  marginBottom: '0',
  flexShrink: 0,
  maxHeight: '270px',
});

export const CommentObjectInfoContainer = styled(Box)({
  display: 'flex',
  flex: 1,
  justifyContent: 'flex-start',
  flexDirection: 'column',
  marginTop: '-5px',
  padding: '0 24px',
});

export const SaveButton = styled(Button)({
  whiteSpace: 'nowrap',
  backgroundColor: '#A855F7',
  borderRadius: '8px',
  boxShadow: 'none',
  gap: '8px',
  textTransform: 'none',
  '&:hover': {
    background: '#9133E9',
    boxShadow: 'none',
  },
});

export const CallButton = styled(Button)({
  borderRadius: '8px',
  backgroundColor: '3479E8',
  height: '42px',
  gap: '8px',
  padding: '0',
  boxShadow: 'none',
  '&:hover': {
    background: '#2362EA',
    boxShadow: 'none',
  },
});

export const WarningButton = styled(Button)({
  color: theme.palette.text.primary,
  padding: '8px 22px',
  whiteSpace: 'nowrap',
  backgroundColor: '#F1F5F9',
  textTransform: 'none',
  borderRadius: '8px',
  fontSize: '15px',
  gap: '8px',
  '&:hover': {
    background: '#E1E7EF',
  },
});

export const DrawerContainer = styled(Stack)({
  width: 450,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  margin: '16px',
  backgroundColor: '#fff',
  borderRadius: '12px',
  overflow: 'hidden',
});

export const DrawerInfoContainer = styled(Stack)({
  width: '370px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  margin: '16px',
  backgroundColor: '#fff',
  borderRadius: '12px',
});

export const DrawerRecognizeContainer = styled(Stack)({
  width: '420px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  margin: '16px',
  backgroundColor: '#fff',
  borderRadius: '12px',
});

export const MainTableContainer = styled(TableContainer)({
  width: '100%',
  overflowY: 'auto',
  height: 'calc(100dvh - 320px)',
});

export const MainTableCallContainer = styled(TableContainer)({
  width: '100%',
  marginTop: '24px',
});

export const PaymentTableContainer = styled(TableContainer)({
  width: '100%',
  overflowY: 'auto',
  height: 'calc(100dvh - 210px)',
});

export const MainTableFavoriteContainer = styled(TableContainer)({
  width: '100%',
  overflowY: 'auto',
  height: 'calc(100dvh - 320px)',
});

export const CrmTableContainer = styled(TableContainer)({
  width: '100%',
  overflowY: 'auto',
  height: 'calc(100dvh - 316px)',
});

export const DrawerMapContainer = styled(Stack)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'none !important',
  padding: '16px',
  width: '100%',
});

export const ColumnHeaderSettings = styled(Box)({
  padding: '3px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const DrawerContainerSettings = styled(Stack)({
  width: '400px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  marginRight: '16px',
  marginTop: '16px',
  marginBottom: '16px',
  backgroundColor: '#fff',
  borderRadius: '12px',
});

export const HeaderCommentBox = styled(Box)({
  padding: '16px 24px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
});

export const BodyCommentBox = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '8px',
  width: '100%',
});

export const CommentSectionName = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  overflow: 'hidden',
});

export const ClearObjectsButton = styled(Button)({
  backgroundColor: '#F1F5F9',
  padding: '8px 22px',
  color: '#000',
  textTransform: 'none',
  borderRadius: '8px',
  '&:hover': {
    background: '#E1E7EF',
  },
});

export const ShowObjectsButton = styled(Button)({
  backgroundColor: '#3479E8',
  padding: '8px 22px',
  textTransform: 'none',
  fontSize: '15px',
  color: '#fff',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: '#2362EA',
  },
  '&:disabled': {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    color: 'rgba(0, 0, 0, 0.26)',
  },
});

export const ShowOnlyUniqueObjectsBox = styled(Typography)({
  color: 'rgba(26, 26, 26, 0.87)',
  fontFeatureSettings: "'clig' off, 'liga' off",
  fontFamily: 'Roboto',
  fontSize: '16px',
  fontStyle: 'normal',
  fontWeight: '400',
  letterSpacing: '0.15px',
});

export const SaveFilterButton = styled(Button)({
  textTransform: 'none',
  borderRadius: '8px',
  boxShadow: 'none',
  fontFamily: 'Roboto',
  marginLeft: '10px',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '14px',
  letterSpacing: '0.42px',
  '&:hover': {
    background: '#2b63be',
    boxShadow: 'none',
  },
});

export const CancelFilterButton = styled(Button)({
  textTransform: 'none',
  borderRadius: '8px',
  boxShadow: 'none',
  fontFamily: 'Roboto',
  color: 'rgba(26, 26, 26, 0.87)',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '14px',
  letterSpacing: '0.42px',
  '&:hover': {
    background: '#d5d3d3',
    boxShadow: 'none',
  },
});
export const UiFormControl = styled(FormControl)(({ theme, ...props }) => ({
  // Классы для selecta
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: props.error ? theme.palette.error.main : theme.palette.primary.main,
  },
  '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
    borderWidth: '1px',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: `2px solid ${props.error ? theme.palette.error.main : theme.palette.primary.main}`,
  },

  // Классы для autocomplete
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: props.error ? theme.palette.error.main : theme.custom.input.border.default,
  },

  '& .MuiAutocomplete-inputRoot': {
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: props.error ? theme.palette.error.main : theme.custom.input.border.default,
    },
  },
}));

export const ContainerStat = styled(Stack)(({ theme }) => ({
  display: 'flex',
  borderRadius: theme.custom.shape.border.radius.md,
  border: `1px solid ${theme.custom.input.border.default}`,
}));

export const ContainerChart = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.custom.layout.body.padding.px,
  alignItems: 'flex-start',
  gap: theme.custom.base.module.third,
  alignSelf: 'stretch',
  boxSizing: 'border-box',
}));

export const CardContainer = styled(Stack)({
  position: 'absolute',
  height: '100%',
  marginBottom: '0px',
  borderRadius: '12px',
  backgroundColor: 'white',
  padding: '16px',
  minWidth: '240px',
});
