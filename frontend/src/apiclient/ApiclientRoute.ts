import {
  CheckHealthData,
  ContactRequest,
  GetExpertiseData,
  GetPartnersData,
  SubmitContactFormData,
} from "./data-contracts";

export namespace Apiclient {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * @description Get all expertise directions. Returns 6 expertise cards with their details. Each card has one color accent for the 3D geometric detail.
   * @tags dbtn/module:expertise
   * @name get_expertise
   * @summary Get Expertise
   * @request GET:/routes/expertise
   */
  export namespace get_expertise {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetExpertiseData;
  }

  /**
   * @description Get all partner companies. Returns partner cards including company name, logo, website link, and optional description.
   * @tags dbtn/module:partners
   * @name get_partners
   * @summary Get Partners
   * @request GET:/routes/partners
   */
  export namespace get_partners {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetPartnersData;
  }

  /**
   * @description Handle contact form submission. Validates and logs contact form data. Sends notification to Telegram.
   * @tags dbtn/module:contact
   * @name submit_contact_form
   * @summary Submit Contact Form
   * @request POST:/routes/contact
   */
  export namespace submit_contact_form {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ContactRequest;
    export type RequestHeaders = {};
    export type ResponseBody = SubmitContactFormData;
  }
}
