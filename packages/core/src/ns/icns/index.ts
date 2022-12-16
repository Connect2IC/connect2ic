import {
  ICNSConstants,
} from './constants';
import {
  Types,
} from './types';
import {
  RecordExt,
} from './registry.did';
import { idlRegistryFactory } from './registry.did'
import { Actor } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import {
  ActorAdapter,
  RegistryActor,
} from '../..';

import { addIcpSuffix, VerifyDomainName } from '@/utils/format'


/**
 * ICNS Registry Controller.
 * This class is responsible for handling all the requests related to the ICNS registry canister.
 */
export class ICNSRegistryController {

  /**
   * Create an instance that communicates with icns registry canister.
   * Some of the functions uses the actor agent identity to identify the user that is interacting.
   * @param {RegistryActor} registryActor actor or an anonymous will be used
   */
  constructor(
    private registryActor: RegistryActor = ActorAdapter.createAnonymousActor<RegistryActor>(
      ICNSConstants.canisterIds.registry,
      idlRegistryFactory
    )
  ) { }

  /**
   * Get the principal of the agent.
   * It is going to throw if the principal is anonymous.
   * @internal
   * @returns {Promise<Principal>} Return Principal stored in agent
   */
  private async getAgentPrincipal(): Promise<Principal> {
    const agent = Actor.agentOf(this.registryActor);
    if (!agent) throw new Error('Agent principal not found');

    const principal = await agent.getPrincipal();

    if (principal.toString() === Principal.anonymous().toString())
      throw new Error('Agent principal is anonymous');

    return agent.getPrincipal();
  }

  /**
   * Get record in registry canister.
   * @param {string} domain Represents user domain, such as: 'test.icp'
   * @returns {Promise<RecordExt | null>} Return record data object. Return null if not set.
   */
  async getRecord(domain: string): Promise<RecordExt | null> {
    if (!VerifyDomainName(domain))
      throw new Error('name format error')
    const name = addIcpSuffix(domain) // guarantee the domain name with .icp suffix
    const response = await this.registryActor.getRecord(name)
    return response[0] ? response[0] : null
  }

  /**
   * Get user's all registed domains in registry canister.
   * @param {Principal} user Represents the Principal id of the user.
   * @returns {Promise<Domain.List>} Return record data object.
   */
  async getUserNames(user: Principal): Promise<Types.DomainList> {
    const response = await this.registryActor.getUserDomains(user)
    if(!response[0]) return []
    return response[0].reduce((parsed: string[], item) => {
      return parsed.concat(item.name)
    }, [])
  }

  /**
   * Get domain resolver in registry canister.
   * @param {string} domain Represents user domain, such as: 'test.icp'
   * @returns {Promise<Principal | null>} Return the Principal id resolved from this domain name, return null if not set.
   */
  async getResolver(domain: string): Promise<Principal | null> {
    if (!VerifyDomainName(domain))
      throw new Error('name format error')
    const name = addIcpSuffix(domain) // guarantee the domain name with .icp suffix
    const response = await this.registryActor.resolver(name)
    return response[0] ? response[0] : null
  }

  /**
   * Get domain owner in registry canister.
   * @param {string} domain Represents user domain, such as: 'test.icp'
   * @returns {Promise<Principal | null>} Return the Principal id of this name's owner, return null if not set.
   */
  async getOwner(domain: string): Promise<Principal | null> {
    if (!VerifyDomainName(domain))
      throw new Error('name format error')
    const name = addIcpSuffix(domain) // guarantee the domain name with .icp suffix
    const response = await this.registryActor.owner(name)
    return response[0] ? response[0] : null
  }

  /**
   * Get domain controller in registry canister.
   * @param {string} domain Represents user domain, such as: 'test.icp'
   * @returns {Promise<Principal  | null>} Return the Principal id of this name's controller, return null if not set.
   */
  async getController(domain: string): Promise<Principal | null> {
    if (!VerifyDomainName(domain))
      throw new Error('name format error')
    const name = addIcpSuffix(domain) // guarantee the domain name with .icp suffix
    const response = await this.registryActor.controller(name)
    return response[0] ? response[0] : null
  }

  /**
   * Get domain ttl in registry canister.
   * @param {string} domain Represents user domain, such as: 'test.icp'.
   * @returns {Promise<bigint | null>} Return TTL value.
   */
  async getTTL(domain: string): Promise<bigint | null> {
    if (!VerifyDomainName(domain))
      throw new Error('name format error')
    const name = addIcpSuffix(domain) // guarantee the domain name with .icp suffix
    const response = await this.registryActor.ttl(name)
    return response[0] ? response[0] : null
  }

  /**
   * Get domain expiry in registry canister.
   * @param {string} domain Represents user domain, such as: 'test.icp'.
   * @returns {Promise<bigint | null>} Return the expiry time of this domain name, return null if not timed.
   */
  async getExpiry(domain: string): Promise<bigint | null> {
    if (!VerifyDomainName(domain))
      throw new Error('name format error')
    const name = addIcpSuffix(domain) // guarantee the domain name with .icp suffix
    const response = await this.registryActor.expiry(name)
    return response[0] ? response[0] : null
  }

  /**
   * Check if domain record exist in registry canister.
   * @param {string} domain Represents user domain, such as: 'test.icp'
   * @returns {Promise<boolean>} Return whether its record exists
   */
  async recordExists(domain: string): Promise<boolean> {
    if (!VerifyDomainName(domain))
      throw new Error('name format error')
    const name = addIcpSuffix(domain) // guarantee the domain name with .icp suffix
    const response = await this.registryActor.recordExists(name)
    return response
  }

  /**
   * Set record according to domain.
   * @param {Types.RecordParams} params The data of the record.
   * @returns {Promise<void>} Return void promise.
   */
  async setRecord(params: Types.RecordParams): Promise<void> {
    if (!VerifyDomainName(params.node))
      throw new Error('name format error')
    const name = addIcpSuffix(params.node) // guarantee the domain name with .icp suffix
    await this.getAgentPrincipal() // get pulg wallet identity this.registryActor
    const result = await this.registryActor.setRecord(name, params.owner, params.registry, params.ttl, params.expiry)
    if ('err' in result) throw new Error(JSON.stringify(result.err));
  }

  /**
   * Set subnoderecord according to domain.
   * @param {Types.RecordParams} params The data of the record.
   * @returns {Promise<void>} Return void promise.
   */
  async setSubnodeRecord(params: Types.RecordParams): Promise<void> {
    if (!VerifyDomainName(params.node))
      throw new Error('name format error')
    const name = addIcpSuffix(params.node) // guarantee the domain name with .icp suffix
    await this.getAgentPrincipal() // get pulg wallet identity this.registryActor
    const result = await this.registryActor.setSubnodeRecord(name, params.sublabel!, params.owner, params.registry, params.ttl, params.expiry)
    if ('err' in result) throw new Error(JSON.stringify(result.err));
  }

  /**
   * Set domain owner according to domain.
   * @param {string} domain Represents user domain, such as: 'test.icp'.
   * @param {Principal} owner Represents the Principal id of the new owner.
   * @returns {Promise<void>} Return void promise
   */
  async setOwner(domain: string, owner: Principal): Promise<void> {
    if (!VerifyDomainName(domain))
      throw new Error('name format error')
    const name = addIcpSuffix(domain) // guarantee the domain name with .icp suffix
    await this.getAgentPrincipal() // get pulg wallet identity this.registryActor
    const result = await this.registryActor.setOwner(name, owner)
    if ('err' in result) throw new Error(JSON.stringify(result.err));
  }

  /**
   * Set domain controller according to domain.
   * @param {Principal} domain Represents user domain, such as: 'test.icp'.
   * @param {Principal} controller Represents new controller.
   * @returns {Promise<void>} Return void promise.
   */
  async setController(domain: string, controller: Principal): Promise<void> {
    if (!VerifyDomainName(domain))
      throw new Error('name format error')
    const name = addIcpSuffix(domain) // guarantee the domain name with .icp suffix
    await this.getAgentPrincipal() // get pulg wallet identity this.registryActor
    const result = await this.registryActor.setController(name, controller)
    if ('err' in result) throw new Error(JSON.stringify(result.err));
  }

  /**
   * Set domain's resolver according to domain.
   * @param {string} domain Represents user domain, such as: 'test.icp'.
   * @param {Principal} resolver Represents new resolver.
   * @returns {Promise<void>} Return void promise.
   */
  async setResolver(domain: string, resolver: Principal): Promise<void> {
    if (!VerifyDomainName(domain))
      throw new Error('name format error')
    const name = addIcpSuffix(domain) // guarantee the domain name with .icp suffix
    await this.getAgentPrincipal() // get pulg wallet identity this.registryActor
    const result = await this.registryActor.setResolver(name, resolver)
    if ('err' in result) throw new Error(JSON.stringify(result.err));
  }

  /**
   * set domain ttl according to domain.
   * @param {string} domain Represents the domain name, such as: 'test.icp'.
   * @param {bigint} ttl Represents the new ttl.
   * @returns {Promise<void>} Return void promise.
   */
  async setTTL(domain: string, ttl: bigint): Promise<void> {
    if (!VerifyDomainName(domain))
      throw new Error('name format error')
    const name = addIcpSuffix(domain) // guarantee the domain name with '.icp' suffix
    await this.getAgentPrincipal() // get pulg wallet identity this.registryActor
    const result = await this.registryActor.setTTL(name, ttl)
    if ('err' in result) throw new Error(JSON.stringify(result.err));
  }

  /**
   * Set sub domain owner according to domain.
   * @param {string} domain Represents user domain, such as: 'test.icp'.
   * @param {string} sublabel Represents sublabel, such as: 'hello.test.icp'.
   * @param {Principal} owner Represents the Principal id of the thenew owner.
   * @returns {Promise<void>} Return void promise.
   */
  async setSubDomainOwner(domain: string, sublabel: string, owner: Principal): Promise<void> {
    if (!VerifyDomainName(domain))
      throw new Error('name format error')
    const name = addIcpSuffix(domain) // guarantee the domain name with '.icp' suffix
    await this.getAgentPrincipal() // get pulg wallet identity this.registryActor
    const result = await this.registryActor.setSubnodeOwner(name, sublabel, owner)
    if ('err' in result) throw new Error(JSON.stringify(result.err));
  }

  /**
   * Set subdomain expiry.
   * @param {string} domain Represents user domain, such as: 'test.icp'.
   * @param {string} sublabel Represents sublabel, such as: 'hello.test.icp'.
   * @param {bigint} newExpiry Represents the new expiry.
   * @returns {Promise<void>} Return void promise.
   */
  async setSubDomainExpiry(domain: string, sublabel: string, newExpiry: bigint): Promise<void> {
    if (!VerifyDomainName(domain))
      throw new Error('name format error')
    const name = addIcpSuffix(domain) // guarantee the domain name with .icp suffix
    await this.getAgentPrincipal() // get pulg wallet identity this.registryActor
    const result = await this.registryActor.setSubnodeExpiry(name, sublabel, newExpiry)
    if ('err' in result) throw new Error(JSON.stringify(result.err));
  }

  // =========================================================================================== //
  //                               DIP721 interfaces
  // =========================================================================================== //

  /**
   * Get whether someone is approved for all domains of an owner.
   * @param {Principal} owner Represents the Principal id of the owner.
   * @param {Principal} operator Represents the principal id of the one to get checked.
   * @returns {Promise<boolean>}
   */
  async isApprovedForAll(owner: Principal, operator: Principal): Promise<boolean> {
    return await this.registryActor.isApprovedForAll(owner, operator)
  }

  /**
   * Get whether someone is approved for specific domain.
   * @param {string} domain Represents domain name.
   * @param {Principal} who Represents the principal id of the one to get checked.
   * @returns {Promise<boolean>}
   */
  async isApproved(domain: string, who: Principal): Promise<boolean> {
    if (!VerifyDomainName(domain))
      throw new Error('name format error')
    const name = addIcpSuffix(domain) // guarantee the domain name with .icp suffix
    return await this.registryActor.isApproved(name, who)
  }

  /**
   * get approved operator of a domain.
   * @param {string} domain Represents domain name.
   * @returns {Promise<Principal | null>} Return Principal id of the approved operator. Return null if no one got approved.
   */
  async getApproved(domain: string): Promise<Principal | null> {
    if (!VerifyDomainName(domain))
      throw new Error('name format error')
    const name = addIcpSuffix(domain) // guarantee the domain name with .icp suffix
    const result = await this.registryActor.getApproved(name)
    return result[0] ? result[0] : null
  }

  /**
   * get user's domain.
   * @param {owner} Represents user identity
   * @returns {Promise<bigint>}
   */
  async balanceOf(owner: Principal): Promise<bigint> {
    return await this.registryActor.balanceOf(owner)
  }


  /**
   * Approve transfers domian from registrar canister.
   * This function uses the actor agent identity.
   * This function needs to be called before operate with registry canister.
   * @param {string} domain Represents domain name to be approved.
   * @param {Principal} operator Represents approve who can operate owner's domain.
   * @returns {Promise<void>} Return void promise.
   */
  async approve(
    domain: string,
    operator: Principal,
  ): Promise<void> {

    await this.getAgentPrincipal(); //this.registryActor

    const result = await this.registryActor.approve(
      domain,
      operator
    );

    if ('err' in result) throw new Error(JSON.stringify(result.err));
  }

  /**
   * Approve transfers domain from registrar canister.
   * This function uses the actor agent identity.
   * This function needs to be called before operate with registry canister.
   * @param {boolean} approved Represents whether the approve operator are approved for all domians.
   * @param {Principal} operator Represents the Principal id of the operator.
   * @returns {Promise<void>} Return void promise.
   */
  async setApprovalForAll(
    approved: boolean,
    operator: Principal,
  ): Promise<void> {

    await this.getAgentPrincipal(); //this.registryActor

    const result = await this.registryActor.setApprovalForAll(
      operator,
      approved,
    );

    if ('err' in result) throw new Error(JSON.stringify(result.err));
  }

  /**
   * transfers domain from owner to others.
   * This function uses the actor agent identity.
   * This function needs to be called before operate with registry canister.
   * @param {string} domain Represents domain name
   * @param {Principal} to Represents who will get the domain
   * @returns {Promise<void>} Return void promise
   */
  async transfer(
    domain: string,
    to: Principal,
  ): Promise<void> {
    if (!VerifyDomainName(domain))
      throw new Error('name format error')
    const name = addIcpSuffix(domain) // guarantee the domain name with .icp suffix

    const principal = await this.getAgentPrincipal(); //this.registryActor
    if (principal !== await this.getOwner(name))
      throw new Error('not domain owner')

    const result = await this.registryActor.transfer(
      to,
      name,
    );

    if ('err' in result) throw new Error(JSON.stringify(result.err));
  }

  /**
   * allow operator transfers domain from owner to others.
   * This function uses the actor agent identity.
   * This function needs to be called before operate with registry canister.
   * @param {string} domain Represents domain name.
   * @param {Principal} from Represents the domain's owner.
   * @param {Principal} to Represents who will get the domain.
   * @returns {Promise<void>} Return void promise.
   */
  async transferFrom(
    domain: string,
    from: Principal,
    to: Principal,
  ): Promise<void> {
    if (!VerifyDomainName(domain))
      throw new Error('name format error')
    const name = addIcpSuffix(domain) // guarantee the domain name with .icp suffix

    const principal = await this.getAgentPrincipal(); //this.registryActor

    if (principal !== await this.getApproved(name))
      throw new Error('not allowed !!!')

    const result = await this.registryActor.transferFrom(
      from,
      to,
      name,
    );

    if ('err' in result) throw new Error(JSON.stringify(result.err));
  }
}