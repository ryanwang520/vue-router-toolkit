import { getCurrentInstance, reactive, watch } from 'vue';
import Router, { Route } from 'vue-router';
type Merge<F, S> = {
  [P in keyof F | keyof S]: P extends keyof S
    ? S[P]
    : P extends keyof F
    ? F[P]
    : never;
};

const useRoute = (): Merge<
  Route,
  { query: Record<string, string | undefined> }
> => {
  const vm = getCurrentInstance()!;
  const route = reactive({ ...vm.proxy.$route });

  watch(
    () => vm.proxy.$route,
    r => {
      Object.assign(route, r);
    }
  );

  return route as any;
};

const useRouter = (): Router => {
  const vm = getCurrentInstance()!;
  return vm.proxy.$router;
};

export { useRouter, useRoute };
