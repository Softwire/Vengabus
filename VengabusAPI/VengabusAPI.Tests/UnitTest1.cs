using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace VengabusAPI.Tests
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestMethod1()
        {
            int testvalue = 1;
            Assert.AreEqual(testvalue, 2 - 1);
        }
    }
}
