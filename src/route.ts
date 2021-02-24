import { getCurrentInstance, reactive, watch } from 'vue-demi';

const useRoute = () => {
  const vm = getCurrentInstance()!;
  const route = reactive({ ...vm.proxy.$route });

  watch(
    () => vm.proxy.$route,
    r => {
      Object.assign(route, r);
    }
  );

  return route;
};

const useRouter = () => {
  const vm = getCurrentInstance()!;
  return vm.proxy.$router;
};

export { useRouter, useRoute };
