import { Info, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { type ItAssetsMovement } from '../interfaces/itAssetsMovementResponse';
import DetailItem from '@/components/custom/DetailItem';

interface Props {
    itAssetMovement: ItAssetsMovement;
}

const ItAssetMovementInDetails = ({ itAssetMovement } :Props) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
  
        {/* Estado Fisico */}
        <div className="relative overflow-hidden bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-xl p-5 sm:p-6 transition-all hover:shadow-md">
            <div className="absolute -right-6 -top-6 text-blue-500/5 dark:text-blue-400/5 pointer-events-none">
            <Info className="h-32 w-32" />
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-2.5 rounded-lg shrink-0 shadow-sm border border-blue-200 dark:border-blue-800">
                <Info className="h-6 w-6 text-blue-700 dark:text-blue-400" />
            </div>
            
            <div className="flex-1 space-y-1.5">
                <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-widest">
                {t("itAssets.components.movementInDetails.statusLabel")}
                </h4>
                <p className="text-lg font-black text-foreground">
                {itAssetMovement.itAsset.itAssetStatus.name || t("itAssets.components.movementInDetails.na")}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {itAssetMovement.itAsset.itAssetStatus.description}
                </p>
            </div>
            </div>
        </div>

        {/* Observaciones */}
        <div className="px-1">
            <DetailItem 
            icon={FileText} 
            label={t("itAssets.components.movementInDetails.observationsLabel")} 
            value={itAssetMovement.movementIn?.observations || t("itAssets.components.movementInDetails.noObservations")} 
            isTextarea 
            />
        </div>

        </div>
  )
}

export default ItAssetMovementInDetails