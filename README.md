# vue-router-toolkit

Tookit for `vue-router`, _Vue 2_ and _Vue 3_ compatible.

## Included batteries.

`useQueryParams` for easy sync _query string_ with local state, providing reasonable typing base on config object.

```ts
import { useQueryParams } from 'vuer-router-toolkit';
const params = useQuerParams({ a: String, b: Number, c: Date });
params.a; // string | undefined
params.b; // number | undefined
params.c; // Date | undefined
```

`useSearch` for handling search form state.

```ts
import { useSearch } from 'vuer-router-toolkit';
const { filters, reset, search } = useSearch({ name: String, mobile: String });
filters.name; // string | undefined
filters.mobile; // string|undefined

filters.name = 'newname'; //
filters.mobile = '121';

search(); // set page to 1, with query name and mobile updated. ?name=newname&mobile=121&page=1

reset(); // reset filters to empty so filters.name == '' and filters.mobile == ''
```

## Type helpers.

```ts
import { ParamType, StringArray, NumberArray } from 'vuer-router-toolkit';
const params = useQueryParams({
  name: String as ParamType<'li'>,
  tags: StringArray,
  ids: NumberArray,
});
typeof params.name; //  'li'
params.tags = ['a', 'b']; // ?tags=a,b
params.ids = [1, 2, 3]; // ?ids=1,2,3
```

Custom field config.

```ts
import { Serializer } from 'vuer-router-toolkit';

type User = {
  name: string;
  age: number;
};

const UserSerializer: Serializer<User> = {
  decode(value: string) {
    if (value == 'name:a,age:13') {
      return { name: 'a', age: 13 };
    }
    return null;
  },
  encode(value: User | null): string {
    return 'name:a,age:13';
  },
};
const params = useQueryParams({ user: UserSerializer });
params.user; // type User
```

## Composables for both _Vue 2_ and _Vue 3_,

```ts
import { useRoute, useRouter } from 'vuer-router-toolkit';

const route = useRoute();
const router = useRouter();
// route and router would be the corresponding type for that specific version
```
