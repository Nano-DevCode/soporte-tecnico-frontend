import { useTranslation } from 'react-i18next'

export const CustomOptionalInput = () => {
    const { t } = useTranslation();
    return (
        <span className='italic text-muted-foreground'>{t('common.inputs.optional')}</span>
    )
}
