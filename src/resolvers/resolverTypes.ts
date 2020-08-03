import { Context } from '../utils'
import { IFieldResolver } from 'apollo-server'

export type ResolverFunction<Parent, Args = any> = IFieldResolver<Parent, Context, Args>
export type MutationResolverFunction<Args = any> = IFieldResolver<
    void,
    Context,
    MutationInput<Args>
>
export type SubscriptionResolverDefinition<Args = Record<string, any>> = {
    subscribe?: IFieldResolver<void, Context, Args>
    resolve?: IFieldResolver<any, Context, Args>
}

export type Resolver<Parent> = { [key: string]: ResolverFunction<Parent> }

export type MutationResolver = { [key: string]: MutationResolverFunction }

export type SubscriptionResolver = { [key: string]: SubscriptionResolverDefinition }

export type MutationInput<T> = {
    input: T
}
