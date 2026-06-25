import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Save, Loader2 } from "lucide-react";
import { isAxiosError } from "axios";
import { sileo } from "sileo";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";

import { useItAssets } from "../hooks/useItAssets";
import useItAssetsStatus from "../hooks/useItAssetsStatus";

import type { BackendError } from "@/interfaces/backendError.interfaces";

import { ItAssetsForm } from "../components/ItAssetsFormPage";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { logError } from "@/utils/logger";


const ItAssetsUpdatePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();

  const {
    updateAssetMutation,
    itAsset,
    isLoadingAsset,
  } = useItAssets();

  const {
    itAssetsStatus,
    isLoading: isLoadingStatus,
  } = useItAssetsStatus();


  const updateAssetSchema = useMemo(
    () =>
      z.object({
        serialNumber: z
          .string()
          .min(1, t("itAssets.updatePage.validation.serialNumber"))
          .trim(),

        idInventary: z.string().trim().optional(),

        typeId: z
          .string()
          .min(1, t("itAssets.updatePage.validation.typeId")),

        brandId: z
          .string()
          .min(1, t("itAssets.updatePage.validation.brandId")),

        modelId: z
          .string()
          .min(1, t("itAssets.updatePage.validation.modelId")),

        statusId: z
          .string()
          .min(1, t("itAssets.updatePage.validation.statusId")),

        invoiceId: z.string().optional(),

        description: z.string().trim().optional(),

        imageFile: z.any().optional(),
      }),
    [t]
  );


  type UpdateAssetFormValues = z.infer<typeof updateAssetSchema>;


  const form = useForm<UpdateAssetFormValues>({
    resolver: zodResolver(updateAssetSchema),

    defaultValues: {
      serialNumber: "",
      idInventary: "",
      typeId: "",
      brandId: "",
      modelId: "",
      statusId: "",
      invoiceId: "",
      description: "",
      imageFile: undefined,
    },
    values: {
      serialNumber: itAsset?.serialNumber || "",
      idInventary: itAsset?.idInventary || "",
      typeId: itAsset?.itAssetsType?.id || "",
      brandId: itAsset?.model?.brand?.id || "",
      modelId: itAsset?.model?.id || "",
      statusId: itAsset?.itAssetStatus?.id || "",
      invoiceId: itAsset?.invoice?.id || "",
      description: itAsset?.description || "",
      imageFile: undefined,
    }
  });


  useEffect(() => {
    if (!itAsset) return;

    form.reset({
      serialNumber: itAsset.serialNumber,
      idInventary: itAsset.idInventary || "",
      typeId: itAsset.itAssetsType?.id || "",
      brandId: itAsset.model?.brand?.id || "",
      modelId: itAsset.model?.id || "",
      statusId: itAsset.itAssetStatus?.id || "",
      invoiceId: itAsset.invoice?.id || "",
      description: itAsset.description || "",
      imageFile: undefined,
    });

  }, [itAsset, form]);


  useEffect(() => {
    if (
      !itAsset?.itAssetStatus?.id ||
      isLoadingStatus ||
      !itAssetsStatus?.length
    ) {
      return;
    }

    form.setValue(
      "statusId",
      itAsset.itAssetStatus.id,
      {
        shouldValidate: true,
        shouldDirty: false,
      }
    );

  }, [
    itAsset,
    itAssetsStatus,
    isLoadingStatus,
    form,
  ]);


  const isUpdating = updateAssetMutation.isPending;


  const onSubmit = async (data: UpdateAssetFormValues) => {
    const formData = new FormData();

    formData.append("serialNumber", data.serialNumber);
    formData.append("modelId", data.modelId);
    formData.append("statusId", data.statusId);
    formData.append("typeId", data.typeId);


    if (data.imageFile instanceof File) {
      formData.append("file", data.imageFile);
    }

    if (data.idInventary) {
      formData.append("idInventary", data.idInventary);
    }

    if (data.invoiceId) {
      formData.append("invoiceId", data.invoiceId);
    }

    if (data.description) {
      formData.append("description", data.description);
    }


    try {
      await sileo.promise(
        updateAssetMutation.mutateAsync({
          id: id!,
          data: formData,
        }),
        {
          loading: {
            title: t("itAssets.updatePage.sileo.loading.title"),
          },

          success: {
            title: t("itAssets.updatePage.sileo.success.title"),
            description: t(
              "itAssets.updatePage.sileo.success.description"
            ),
            duration: 4000,
          },

          error: (err) => {
            let backendMessage = t(
              "itAssets.updatePage.sileo.error.defaultMessage"
            );

            if (
              isAxiosError<BackendError>(err) &&
              err.response?.data?.message
            ) {
              const rawMessage = err.response.data.message;

              backendMessage = Array.isArray(rawMessage)
                ? rawMessage[0]
                : rawMessage;
            }

            return {
              title: t("itAssets.updatePage.sileo.error.title"),
              description: backendMessage,
              duration: 5000,
            };
          },
        }
      );

      navigate("/it-assets");

    } catch (error) {
      logError(error, "ItAssetsUpdatePage");
    }
  };


  if (isLoadingAsset) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />

        <p className="text-muted-foreground">
          {t("itAssets.updatePage.loading")}
        </p>
      </div>
    );
  }


  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">

      <CustomTitlePageWithBack
        backLink="/it-assets"
        title={t("itAssets.updatePage.header.title")}
        description={t("itAssets.updatePage.header.description")}
      />


      <Card>

        <CardHeader>
          <CardTitle>
            {t("itAssets.updatePage.card.title")}
          </CardTitle>

          <CardDescription>
            {t("itAssets.updatePage.card.description")}
          </CardDescription>
        </CardHeader>


        <CardContent>

          <Form {...form}>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >

              <ItAssetsForm
                isSaving={isUpdating}
                itAssetsStatus={itAssetsStatus}
                isLoadingStatus={isLoadingStatus}
                showObservations={false}
                itAssetInitialData={itAsset}
              />


              <div className="flex justify-end gap-4 pt-4 border-t">

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isUpdating}
                >
                  {t("itAssets.updatePage.buttons.cancel")}
                </Button>


                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("itAssets.updatePage.buttons.submitting")}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {t("itAssets.updatePage.buttons.submit")}
                    </>
                  )}
                </Button>

              </div>

            </form>

          </Form>

        </CardContent>

      </Card>

    </div>
  );
};


export default ItAssetsUpdatePage;