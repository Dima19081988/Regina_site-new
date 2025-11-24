export const extractKeyFromUrl = (url: string, bucketName: string): string => {
  const prefix = `https://${bucketName}.storage.yandexcloud.net/`;
  if (!url.startsWith(prefix)) {
    throw new Error(`URL не принадлежит бакету "${bucketName}": ${url}`);
  }
  return url.slice(prefix.length);
};
