export interface PackageName {
  controller: string;
  restController: string;
  dto: string;
  repository: string;
  service: string;
  serviceImpl: string;
}

export interface DtoAnnotation {
  data: boolean;
  getter: boolean;
  setter: boolean;
  builder: boolean;
  noArgsConstructor: boolean;
  allArgsConstructor: boolean;
}

export interface ClassNameSuffix {
  controller: string;
  restController: string;
  dto: string;
  repository: string;
  service: string;
  serviceImpl: string;
}
