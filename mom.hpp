//https://stackoverflow.com/a/40483540
//"member of member" pointer

template<typename C, typename T, size_t P>
union MOMPointerImpl final
{
	template<typename U>
	struct Helper
	{
		using Type = U C::*;
	};
	
	template<typename U>
	struct Helper<U&>
	{
		using Type = U C::*;
	};
	
	typename Helper<T>::Type o;
	size_t i = P;
	static_assert(sizeof(i) == sizeof(o));
};

#define MOM_POINTER(C, M) \
((MOMPointerImpl<__typeof__(C), decltype(((__typeof__(C)*) nullptr)->M), __builtin_offsetof(__typeof__ (C), M)>{ }).o)
