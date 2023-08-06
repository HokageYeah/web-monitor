import { variableTypeDetection } from "./verifyType";

export const resourceTransform = (str: string): string => {
  const instr = interceptStr(str, 120) + "; 资源加载失败";
  return instr;
};

export const interceptStr = (str: string, interceptLength: number): string => {
  if (variableTypeDetection.isString(str)) {
    return (
      str.slice(0, interceptLength) +
      (str.length > interceptLength ? `:截取前${interceptLength}个字符` : "")
    );
  }
  return "";
};
