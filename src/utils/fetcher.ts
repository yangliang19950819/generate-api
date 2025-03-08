import { isArray, isObject, isString } from "lodash";

type BodyType<Body = unknown> = BodyInit | null | undefined | Body;

interface FetcherOptions<Body = unknown> extends Omit<RequestInit, "body"> {
  body?: BodyType<Body>;
  isDownloadFile?: boolean;
}

interface CommonResponse<Data = unknown> {
  data: Data;
  code: number;
  message: string;
  requestId: string;
  result: boolean;
  serverTime: number;
  version: string;
}

const contentType = "content-type",
  applicationJson = "application/json",
  textPlain = "text/plain",
  Contenttype = "Content-type",
  dispositionType = "Content-Disposition";

const fetcher = <Data = unknown, Body = unknown>(
  url: string,
  options?: FetcherOptions<Body>
): Promise<Data> => {
  const { headers, body, isDownloadFile, ...restOptions } = options || {};

  const contentTypeHeader = hasContentTypeHeader(headers)
    ? null
    : detectContentTypeHeader(body);

  return fetch(url, {
    method: restOptions.method || "POST",
    body: isRecord(body) ? JSON.stringify(body) : body,
    headers: {
      ...(contentTypeHeader ? { Contenttype: contentTypeHeader } : {}),
      ...transformHeadersToObject(headers),
    },
    ...restOptions,
  })
    .then((response) => {
      if (response) {
        if (response.ok) {
          if (isDownloadFile) return handleDownloadFile(response);
          return response.json();
        }
        return response;
      }
    })
    .then((res) => {
      // 根据状态码校验处理
      return res;
    });
};

const hasContentTypeHeader = (headers: HeadersInit | null | undefined) => {
  if (isArray(headers)) {
    return headers.some(([key]) => key.toLowerCase() === contentType);
  }
  if (headers instanceof Headers) {
    return headers.has("Content-type");
  }
  if (isObject(headers)) {
    return Object.keys(headers).some(
      (key) => key.toLowerCase() === contentType
    );
  }
};

const detectContentTypeHeader = (body: BodyType): string | null => {
  if (body === null || body === undefined) {
    return null;
  }
  if (isFormData(body)) {
    return null;
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (isArrayBuffer(body)) {
    return null;
  }
  if (isString(body)) {
    try {
      JSON.parse(body);
      return applicationJson;
    } catch (error) {
      return textPlain;
    }
  }
  if (isRecord(body)) {
    return applicationJson;
  }
  return null;
};

const isFormData = (v: unknown): v is FormData => {
  return v !== undefined && v instanceof FormData;
};

const isBlob = (v: unknown): v is Blob => {
  return v !== undefined && v instanceof Blob;
};

const isArrayBuffer = (v: unknown): v is ArrayBuffer => {
  return v !== undefined && v instanceof ArrayBuffer;
};

const isRecord = (body: BodyType): body is unknown => {
  return (
    body !== null &&
    isObject(body) &&
    !isString(body) &&
    !(body instanceof Blob) &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams)
  );
};

const transformHeadersToObject = (
  headers: HeadersInit | null | undefined
): Record<string, string> => {
  if (isArray(headers)) {
    return headers.reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value }),
      {}
    );
  }
  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }
  return {};
};

const getFileNameFromContentDisposition = (
  contentDisposition: string | null
) => {
  const unknownStr = "unknown";
  if (!contentDisposition) return unknownStr;
  const arr = contentDisposition.split("filename=");
  if (!arr[1]) return unknownStr;
  const fileName = arr[1].split(";")[0].replace(/"/g, "");
  return decodeURIComponent(fileName.replace(/%25/g, "%")) || unknownStr;
};

const handleDownloadFile = async (response: Response) => {
  const contentType = response.headers.get(Contenttype),
    disposition = response.headers.get(dispositionType);
  if (
    (!contentType && !disposition) ||
    (contentType && contentType.includes(applicationJson))
  ) {
    return response.json();
  }
  const blob = await response.blob(),
    fileName = getFileNameFromContentDisposition(disposition),
    url = URL.createObjectURL(blob),
    a = document.createElement("a");

  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};

export default fetcher;
