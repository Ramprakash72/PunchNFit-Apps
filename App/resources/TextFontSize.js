import {getFontSize} from './ResponsiveHelper'

const TextFontSize = {

    TEXT_SIZE_EXTRA_LARGE: getFontSize(32),
    TEXT_SIZE_LARGE: getFontSize(28),
    TEXT_SIZE_MEDIUM: getFontSize(21),
    TEXT_SIZE_SEMI_MEDIUM: getFontSize(18),
    TEXT_SIZE_TWENTY_FOUR: getFontSize(24),
    TEXT_SIZE_SMALL: getFontSize(16),
    TEXT_SIZE_VERY_SMALL: getFontSize(Platform.OS === "ios" ? 12 : 14 ),

    TEXT_MEDIUM:getFontSize(15),
    TEXT_MEDIUM_SMALL:getFontSize(14),
    TEXT_LARGE:getFontSize(30),
    TEXT_EXTRA_LARGE:getFontSize(35),
    TEXT_SMALL:getFontSize(12),

}

export default TextFontSize
