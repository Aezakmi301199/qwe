import { styled } from '@mui/material/styles';
import { FontSize } from '../../../shared/enums/font-size.enum';
import { FontWeight } from '../../../shared/enums/font-weight.enum';
import { Box, Button, Chip, Stack, ToggleButton, Typography } from '@mui/material';
import { theme } from '../../../app/providers/theme';

export const NavigateTypography = styled(Typography)(() => ({
  padding: '12px 16px',
  borderRadius: '8px',
  fontFamily: 'Roboto',
  component: 'span',
  fontSize: FontSize.SIXTEENTH_FONT,
  fontWeight: FontWeight.MEDIUM,
  gap: '20px',
  display: 'flex',
}));

export const TitleTypography = styled(Typography)(() => ({
  fontFamily: 'Roboto',
  fontWeight: FontWeight.SEMI_BOLD,
  fontSize: FontSize.TWENTY_FOUR_FONT,
  color: theme.palette.text.primary,
}));

export const PrimaryTypography = styled(Typography)(() => ({
  fontFamily: 'Roboto',
  fontWeight: FontWeight.MEDIUM,
  fontSize: FontSize.TWENTY_FONT,
  color: theme.palette.text.primary,
}));

export const AlertTypography = styled(Typography)(() => ({
  fontFamily: 'Roboto',
  fontWeight: FontWeight.REGULAR,
  fontSize: FontSize.FOURTEENTH_FONT,
  color: '#065782',
}));

export const RateButton = styled(ToggleButton)(() => ({
  borderRadius: '8px',
  textTransform: 'none',
  fontSize: FontSize.FOURTEENTH_FONT,
  lineHeight: '24px',
  fontFamily: 'Roboto',
  fontWeight: FontWeight.MEDIUM,
  color: theme.palette.text.primary,
}));

export const DefaultCard = styled(Box)(() => ({
  padding: '32px 32px 24px 32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  borderRadius: '16px',
}));

export const PremiumCard = styled(Box)(() => ({
  padding: '40px 32px 32px 32px',
  height: '490px',
  width: '322px',
  display: 'flex',
  flexDirection: 'column',
  background:
    'radial-gradient(55.41% 74.01% at 125.77% 98.01%, rgba(200, 211, 254, 0.70) 0%, rgba(99, 102, 242, 0.70) 100%), #6467F3',
  border: '1px solid #D1D1D1',
  gap: '40px',
  borderRadius: '16px',
}));

export const InfoTitle = styled(Typography)(() => ({
  lineHeight: '24px',
  letterSpacing: '0.024px',
  fontSize: FontSize.SIXTEENTH_FONT,
  color: theme.palette.common.white,
}));

export const ConnectPlus = styled(Button)(() => ({
  width: 'auto',
  padding: '8px 22px',
  boxShadow: 'none',
  borderRadius: '8px',
  backgroundColor: theme.palette.common.white,
  color: theme.palette.text.primary,
  fontSize: FontSize.FIFTEENTH_FONT,
  textTransform: 'none',
  '&:hover': {
    background: 'rgb(241,241,241)',
    boxShadow: 'none',
  },
}));

export const GetPlusOnYearButton = styled(Button)(() => ({
  textTransform: 'none',
  fontSize: '13px',
  fontWeight: '500',
  lineHeight: '22px',
  color: theme.palette.common.white,
  backgroundColor: '#6366F2',
  fontFamily: 'Roboto',
  width: '100%',
  borderRadius: '8px',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#4f53e7',
    boxShadow: 'none',
  },
  whiteSpace: 'nowrap',
}));

export const TryButton = styled(Button)(() => ({
  textTransform: 'none',
  fontSize: '15px',
  fontWeight: '500',
  lineHeight: '25px',
  color: theme.palette.common.white,
  backgroundColor: '#6366F2',
  fontFamily: 'Roboto',
  borderRadius: '8px',
  boxShadow: 'none',
  width: 'auto',
  padding: '8px 22px',
  marginTop: '24px',
  '&:hover': {
    backgroundColor: '#4f53e7',
    boxShadow: 'none',
  },
}));

export const GetPlusOnMonthButton = styled(Button)(() => ({
  textTransform: 'none',
  fontSize: '13px',
  fontWeight: '500',
  lineHeight: '22px',
  backgroundColor: theme.palette.common.white,
  color: theme.palette.text.primary,
  fontFamily: 'Roboto',
  width: '100%',
  borderRadius: '8px',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#F1F5F9',
    boxShadow: 'none',
  },
}));

export const CloseContainer = styled(Box)(() => ({
  position: 'absolute',
  width: '100%',
  top: '8px',
  right: '8px',
  display: 'flex',
  justifyContent: 'flex-end',
}));

export const FirstFakeContainer = styled(Box)(() => ({
  position: 'absolute',
  width: '425px',
  height: '305px',
  top: '10px',
  backgroundColor: 'white',
  opacity: '0.6',
  borderRadius: '11.4px',
}));

export const SecondFakeContainer = styled(Box)(() => ({
  position: 'absolute',
  width: '448px',
  height: '312px',
  top: '30px',
  backgroundColor: 'white',
  opacity: '0.9',
  borderRadius: '11.4px',
}));

export const InfoPlusContainer = styled(Box)(() => ({
  marginTop: '48px',
  width: '423px',
  height: '288px',
  padding: '24px',
  zIndex: 1,
  backgroundColor: 'white',
  borderRadius: '16px',
}));

export const InfoCardContainer = styled(Stack)(() => ({
  justifyContent: 'space-between',
  marginLeft: '56px',
  position: 'relative',
  borderLeft: '3px solid #828DF8',
  borderRadius: '4px',
  backgroundColor: '#F0F3FF',
  padding: '8px',
  width: '352px',
  height: '164px',
}));

export const GetPlusButtonModal = styled(Button)(() => ({
  textTransform: 'none',
  fontSize: '15px',
  fontWeight: '500',
  width: 'auto',
  lineHeight: '22px',
  height: '42px',
  color: theme.palette.common.white,
  backgroundColor: '#6366F2',
  fontFamily: 'Roboto',
  padding: '8px 22px',
  borderRadius: '8px',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#4f53e7',
    boxShadow: 'none',
  },
}));

export const PlusContainer = styled(Stack)(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  borderRadius: '12px',
  backgroundColor: 'rgba(240, 243, 255, 1)',
  marginBottom: '16px',
}));

export const ConnectBotButton = styled(Button)(() => ({
  width: '330px',
  fontSize: FontSize.FIFTEENTH_FONT,
  fontWeight: FontWeight.MEDIUM,
  padding: '8px 22px',
  backgroundColor: '#3479E8',
  borderRadius: '8px',
  color: 'white',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#3175e3',
    boxShadow: 'none',
  },
}));

export const TelegramContainer = styled(Stack)(() => ({
  marginTop: '40px',
  height: 'auto',
  padding: '32px 24px',
  borderRadius: '16px',
}));

export const TelegramIconContainer = styled(Box)(() => ({
  width: '32px',
  height: '32px',
  backgroundColor: '#60A5FA',
  borderRadius: '140px',
  padding: '12px',
}));

export const TelegramInfoContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  width: '330px',
}));

export const ErrorText = styled(Typography)(() => ({
  marginTop: '3px',
  color: '#EE4343',
  fontSize: '12px',
}));

export const ConnectedBotContainer = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  gap: '24px',
}));

export const InfoChip = styled(Chip)(() => ({
  width: 'fit-content',
  display: 'flex',
  padding: '3px',
  alignItems: 'center',
  border: 'none',
  backgroundColor: '#3479E8',
  color: theme.palette.common.white,
}));

export const DisableBotButton = styled(Button)(() => ({
  padding: '8px 22px',
  textTransform: 'none',
  boxShadow: 'none',
  fontSize: '15px',
  borderRadius: '8px',
  width: '330px',
  height: '42px',
}));

export const SubscriptionPlanFeatureTitleTypography = styled(Typography)(() => ({
  fontSize: FontSize.TWENTY_FOUR_FONT,
  fontWeight: FontWeight.SEMI_BOLD,
  color: theme.palette.text.primary,
}));

export const SubscriptionPlanFeatureDescriptionTypography = styled(Typography)(() => ({
  marginTop: '12px',
  color: theme.palette.text.primary,
}));

export const StatusChip = styled(Chip)(() => ({
  padding: '3px',
  height: '24px',
  backgroundColor: 'white',
  border: '1px solid rgba(209, 209, 209, 1)',
}));

export const NewQRButton = styled(Button)(() => ({
  textTransform: 'none',
  gap: '8px',
  borderRadius: '8px',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#3175e3',
    boxShadow: 'none',
  },
}));
