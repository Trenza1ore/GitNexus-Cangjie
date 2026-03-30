package example.client

import example.svc.*

/**
 * `private var x: T = factory()` — declared type must index on Const for this.engine.* resolution.
 */
public class TypedProvider {
    private var engine: Engine = getEngineService()

    public init() {}

    public func fetchTyped(peerType: String): Int32 {
        return this.engine.engineGet(peerType)
    }
}
