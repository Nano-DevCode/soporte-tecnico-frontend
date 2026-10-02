import { soporteTecnicoApi } from "../../api/soporteTecnicoApi";
// import { t } from "i18next";

export const getEquipmentByIdAction = async (idOrObject: string | { id: string }) => {
  try {
    const id = typeof idOrObject === 'object' ? idOrObject.id : idOrObject;

    if (!id || id === 'undefined') return null;

    const { data } = await soporteTecnicoApi.get(`/equipments/${id}`);
    return data;
  } catch (error) {
    // console.error(t("api_equipments_by_id_console_error"), error);
    void error;
    // Lanzamos el error para que useQuery sepa que falló
    // throw erro;
  }
};