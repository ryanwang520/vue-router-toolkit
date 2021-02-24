import { computed, reactive, UnwrapRef } from 'vue-demi';
import dayjs from 'dayjs';
import { useRoute, useRouter } from './route';

type ParamType<T = any> =
  | { decode(value: string | null): T; encode(value: any): string }
  | Constructor<T>
  | { (): T };
export { ParamType };

type Constructor<T> = { new (...args: any[]): T & Record<string, unknown> };

type Serializer<T> = {
  decode(value: string | null): T;
  encode(value: T): string;
};
const StringArray: Serializer<string[]> = {
  decode(value): string[] {
    if (!value) {
      return [];
    }
    return value.split(',');
  },
  encode(value) {
    return value.join(',');
  },
};
const NumberArray: Serializer<number[]> = {
  decode(value): number[] {
    if (!value) {
      return [];
    }
    return value.split(',').map(Number);
  },
  encode(value) {
    return value.join(',');
  },
};

type InferPropType<P = any> = P extends typeof Date
  ? Date
  : P extends Serializer<infer R>
  ? R | undefined
  : P extends ParamType<infer T>
  ? unknown extends T
    ? any
    : T | undefined
  : any;

type InferProps<P extends Record<string, any>> = {
  [K in keyof P]: InferPropType<P[K]>;
};

function getValue(value: string | null, type: InferPropType) {
  if (type == Number) {
    return Number(value);
  }
  if (type == Date) {
    return value ? dayjs(value, 'YYYY-MM-DD').toDate() : null;
  }
  if (type == Boolean) {
    return value && ['1', 'true'].includes(value);
  }
  if ('decode' in type) {
    return type['decode'](value);
  }
  return value;
}

function setValue(value: unknown, type: ParamType) {
  if (type == Number) {
    return String(value);
  }
  if (type == Boolean) {
    return value ? '1' : '';
  }
  if (type == Date) {
    return value && value instanceof Date
      ? dayjs(value).format('YYYY-MM-DD')
      : null;
  }
  if ('encode' in type) {
    return type['encode'](value);
  }
  return value;
}

function useQueryParams<Props extends Record<string, ParamType>>(
  params: Props
): InferProps<Props> {
  const route = useRoute();
  const router = useRouter();

  const data = reactive(
    Object.keys(params).reduce((obj: any, param) => {
      obj[param] = computed({
        get() {
          return getValue(route.query[param] as string, params[param]);
        },
        set(value) {
          const newValue = setValue(value, params[param]);
          // @ts-expect-error
          router.push({ query: { ...route.query, [param]: newValue } });
        },
      });
      return obj;
    }, {})
  );

  return data;
}

function useSearch<Props extends Record<string, InferPropType>>(
  params: Props
): {
  reset(): void;
  search(): void;
  filters: UnwrapRef<InferProps<Props>>;
} {
  const route = useRoute();
  const router = useRouter();
  const filters = reactive<InferProps<Props>>(
    Object.keys(params).reduce((obj: any, param) => {
      obj[param] = getValue(route.query[param] as string, params[param]);
      return obj;
    }, {})
  );
  const search = () => {
    const newQuery = {
      ...route.query,
    };
    // @ts-expect-error
    Object.keys(filters).forEach(key => {
      // @ts-expect-error
      if (!filters[key]) {
        delete newQuery[key];
      } else {
        const type = params[key];
        // @ts-expect-error
        newQuery[key] = setValue(filters[key], type);
      }
    });
    if ('page' in route.query) {
      newQuery.page = '1';
    }

    router.push({
      query: newQuery,
    });
  };
  const reset = () => {
    Object.keys(params).forEach(param => {
      // @ts-expect-error
      filters[param] = null;
    });
    search();
  };

  return { filters, reset, search };
}

export { useQueryParams, useSearch, NumberArray, StringArray, Serializer };
