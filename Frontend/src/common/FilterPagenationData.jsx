import axios from "axios";
export const FilterPagenationData = async ({
  create_new_arr = false,
  state,
  data,
  page,
  countRoute,
  data_to_sent = {},
}) => {
  let obj;

  if (state != null && !create_new_arr) {
    obj = {
      ...state,
      results: [...state.results, ...data],
      page: page,
    };
  } else {
    await axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + countRoute, data_to_sent)
      .then(({ data: { totalDocs } }) => {
        obj = {
          results: data,
          page: 1,
          totalDocs,
        };
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return obj;
};
