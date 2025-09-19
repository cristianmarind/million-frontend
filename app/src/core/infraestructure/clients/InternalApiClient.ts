import 'server-only'
import _ from 'lodash'
import axios from 'axios'

const API_URL = process.env.INTERNAL_API_URL;
const APP_TOKEN = process.env.APP_TOKEN;

interface ApiResponse<T> {
  data: T;
  status: string;
  error?: string;
}

export default class InternalApiClient {

  constructor() {
    axios.interceptors.request.use(function (config) {
      config.headers.Authorization = APP_TOKEN;
      return config;
    });
  }

  fetchData = async (endpoint: string, data: any = {}, config: any = {}) => {
    try {
      const response = await axios.post(`${API_URL}/${endpoint}`, data, config);

      console.log(response.data);
      const responseData: ApiResponse<any> = response.data;

      if (_.get(responseData, 'status') !== 'success') {
        throw new Error(responseData.error || 'Error fetching data from API');
      }


      return _.get(response, 'data.value', null);
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
}