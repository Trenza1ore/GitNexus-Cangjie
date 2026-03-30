package example.client

import example.svc.*

/**
 * Local `parse` shadows the name; `getCore().parse()` must resolve to Core.parse.
 */
public class Adapter {
    public init() {}

    public func parse(): Int32 {
        return 1
    }

    public func viaFactory(): Int32 {
        return getCore().parse()
    }
}
