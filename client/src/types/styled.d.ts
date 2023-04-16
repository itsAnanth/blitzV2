import 'styled-components';
import { Theme } from '../data/theme';

declare module "styled-components" {
    export interface DefaultTheme extends Theme {};
}