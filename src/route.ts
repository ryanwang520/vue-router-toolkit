import { getCurrentInstance, reactive, watch } from 'vue-demi';
import Router, { Route } from 'vue-router';

const useRoute = (): Route => {
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
