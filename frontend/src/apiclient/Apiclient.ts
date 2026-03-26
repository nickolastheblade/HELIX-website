import {
  CheckHealthData,
  ContactRequest,
  GetExpertiseData,
  GetPartnersData,
  SubmitContactFormData,
  SubmitContactFormError,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Apiclient<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * @description Get all expertise directions. Returns 6 expertise cards with their details. Each card has one color accent for the 3D geometric detail.
   *
   * @tags dbtn/module:expertise
   * @name get_expertise
   * @summary Get Expertise
   * @request GET:/routes/expertise
   */
  get_expertise = (params: RequestParams = {}) =>
    this.request<GetExpertiseData, any>({
      path: `/routes/expertise`,
      method: "GET",
      ...params,
    });

  /**
   * @description Get all partner companies. Returns partner cards including company name, logo, website link, and optional description.
   *
   * @tags dbtn/module:partners
   * @name get_partners
   * @summary Get Partners
   * @request GET:/routes/partners
   */
  get_partners = (params: RequestParams = {}) =>
    this.request<GetPartnersData, any>({
      path: `/routes/partners`,
      method: "GET",
      ...params,
    });

  /**
   * @description Handle contact form submission. Validates and logs contact form data. Sends notification to Telegram.
   *
   * @tags dbtn/module:contact
   * @name submit_contact_form
   * @summary Submit Contact Form
   * @request POST:/routes/contact
   */
  submit_contact_form = (data: ContactRequest, params: RequestParams = {}) =>
    this.request<SubmitContactFormData, SubmitContactFormError>({
      path: `/routes/contact`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
