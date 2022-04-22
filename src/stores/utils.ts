
const picPath = (ppid: IPlantPicId | undefined) => {
  // No ppid or no key => no small pic.
  if (!ppid?.key)
    return "/plantpics/no-pic.jpg";

  return `/plantpics/p${ppid.plantId.toString().padStart(4, "0")}_${ppid.picId.toString().padStart(2, "0")}_${ppid.key}.jpg`;
};

export const picPaths = (plantId: number, pics: string) => {
  let picList = <IPlantPicId[]>JSON.parse(pics);
  picList = picList.map(a => ({ ...a, plantId }));
  let smPath = picPath(picList.find(a => a.picId === 0));

  let lgPaths = picList
    .filter(a => a.picId !== 0)
    .map(a => ({ picId: a.picId, path: picPath(a) }));

  return { smPath, lgPaths };
};

declare var appVersionKey: string;
export const getAppVersion = () => appVersionKey;