import { z } from 'zod';

const message: string = 'Must be a valid type';

export const Environments = z.object({
  REACT_APP_MAPS_SCRIPT_URL: z.string().url({ message: message }),
  REACT_APP_PROXY: z.string().url({ message: message }),
  REACT_APP_CDN: z.string().url({ message: message }),
  REACT_APP_RIES_URL: z.string().url({ message: message }),
  REACT_APP_RHOOD_BOT: z.string({ invalid_type_error: message }),
  REACT_APP_TELEGRAM_URL: z.string({ invalid_type_error: message }),
  REACT_APP_TECHNICAL_SUPPORT: z.string({ invalid_type_error: message }),
  REACT_APP_KB_ESOFT_TECH: z.string().url({ message: message }),
  REACT_APP_SAFE_WAY: z.string().url({ message: message }),
  REACT_APP_NSPK_URL: z.string().url({ message: message }),
});

type Environment = z.TypeOf<typeof Environments>;

const ensureEnvironments = (): Environment => {
  return Environments.parse(process.env);
};

export const environments = ensureEnvironments();
